import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RequestedProductsScreen } from "@/components/requested-products-screen";
import { CryptoService } from "@/shared/encrypt";

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

type RequestedProduct = {
  id: string;
  productType: string;
  title: string;
  amount: number | null;
  term: number | null;
  status: string;
};

function isEncryptedPayload(value: unknown): value is EncryptedPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.iv === "string" &&
    typeof candidate.tag === "string" &&
    typeof candidate.data === "string"
  );
}

function normalizeRequestedProducts(payload: unknown): RequestedProduct[] {
  const collections = (() => {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (!payload || typeof payload !== "object") {
      return [];
    }

    if (
      "products" in payload &&
      Array.isArray((payload as { products?: unknown }).products)
    ) {
      return (payload as { products: unknown[] }).products;
    }

    if (
      "data" in payload &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      const data = (payload as { data: unknown[] }).data;
      const firstItem = data[0];

      if (
        firstItem &&
        typeof firstItem === "object" &&
        "products" in firstItem &&
        Array.isArray((firstItem as { products?: unknown }).products)
      ) {
        return (firstItem as { products: unknown[] }).products;
      }

      return data;
    }

    if ("data" in payload) {
      const data = (payload as { data?: unknown }).data;

      if (data && typeof data === "object") {
        return [data];
      }
    }

    return [];
  })();

  return collections
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .map((item, index) => {
      const productType =
        typeof item.productType === "string"
          ? item.productType
          : typeof item.type === "string"
            ? item.type
            : `PRODUCT_${index + 1}`;

      const title =
        typeof item.title === "string"
          ? item.title
          : typeof item.productName === "string"
            ? item.productName
            : productType;

      return {
        id:
          typeof item.id === "string"
            ? item.id
            : typeof item.requestId === "string"
              ? item.requestId
              : `${productType}-${index}`,
        productType,
        title,
        amount:
          typeof item.amount === "number"
            ? item.amount
            : typeof item.amount === "string"
              ? Number(item.amount)
              : null,
        term:
          typeof item.term === "number"
            ? item.term
            : typeof item.term === "string"
              ? Number(item.term)
              : null,
        status:
          typeof item.status === "string" ? item.status : "Registrado",
      };
    });
}

export default async function RequestedProductsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");
  const documentType = cookieStore.get("session_document_type");
  const documentNumber = cookieStore.get("session_document_number");
  const backApi = process.env.BACKENDAPI;

  if (!sessionToken?.value || !documentType?.value || !documentNumber?.value) {
    redirect("/");
  }

  if (!backApi) {
    return (
      <RequestedProductsScreen
        products={[]}
        errorMessage="La variable de entorno BACKENDAPI no esta configurada."
      />
    );
  }

  const user = `${documentType.value}${documentNumber.value}`;

  let products: RequestedProduct[] = [];
  let errorMessage: string | null = null;

  try {
    const cryptoService = new CryptoService();
    const response = await fetch(
      `${backApi}/products/v1/read?user=${encodeURIComponent(user)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken.value}`,
        },
        cache: "no-store",
      },
    );

    const rawPayload = await response.json().catch(() => null);
    const payload = isEncryptedPayload(rawPayload)
      ? cryptoService.decrypt(rawPayload)
      : rawPayload;

    console.log("Requested products raw response:", rawPayload);
    console.log("Requested products decrypted response:", payload);

    if (!response.ok) {
      errorMessage =
        payload && typeof payload === "object" && "message" in payload
          ? String(payload.message)
          : "No fue posible cargar los productos creados.";
    } else {
      products = normalizeRequestedProducts(payload);
    }
  } catch {
    errorMessage =
      "No fue posible conectar con el servicio de productos creados.";
  }

  return (
    <RequestedProductsScreen
      products={products}
      errorMessage={errorMessage}
    />
  );
}
