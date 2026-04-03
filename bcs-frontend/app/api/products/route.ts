import { cookies } from "next/headers";
import { CryptoService } from "@/shared/encrypt";

const productImages: Record<string, string> = {
  CDT: "/cdt.png",
  MORTGAGE: "/vivienda.png",
  CREDIT_CARD: "/cuenta.png",
  SAVINGS_ACCOUNT: "/cuentamiga.png",
  PERSONAL_LOAN: "/cuenta.png",
};

const productTitles: Record<string, string> = {
  CDT: "CDT",
  MORTGAGE: "Credito Hipotecario",
  CREDIT_CARD: "Tarjeta de Credito",
  SAVINGS_ACCOUNT: "Cuenta Amiga",
  PERSONAL_LOAN: "Libre inversion",
};

type ApiProduct = {
  type: string;
  title: string;
  amount: number;
  description: string;
};

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
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

function normalizeProducts(payload: unknown) {
  const rawProducts = (() => {
    if (Array.isArray(payload)) {
      return payload as ApiProduct[];
    }

    if (!payload || typeof payload !== "object") {
      return [];
    }

    if (
      "products" in payload &&
      Array.isArray((payload as { products?: unknown }).products)
    ) {
      return (payload as { products: ApiProduct[] }).products;
    }

    if (
      "data" in payload &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      const firstItem = (payload as { data: unknown[] }).data[0];

      if (
        firstItem &&
        typeof firstItem === "object" &&
        "products" in firstItem &&
        Array.isArray((firstItem as { products?: unknown }).products)
      ) {
        return (firstItem as { products: ApiProduct[] }).products;
      }
    }

    return [];
  })();

  return rawProducts.map((product, index) => ({
    type: product.type,
    title: productTitles[product.type] ?? product.title,
    amount: product.amount,
    description: product.description,
    image: productImages[product.type] ?? "/cuenta.png",
    badge: index === 0 ? "Disponible hasta 30 Abr 2026" : undefined,
  }));
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");
  const documentType = cookieStore.get("session_document_type");
  const documentNumber = cookieStore.get("session_document_number");
  const backApi = process.env.BACKENDAPI;

  if (!sessionToken?.value || !documentType?.value || !documentNumber?.value) {
    return Response.json(
      { message: "Sesion invalida o incompleta." },
      { status: 401 },
    );
  }

  if (!backApi) {
    return Response.json(
      { message: "La variable de entorno BACKENDAPI no esta configurada." },
      { status: 500 },
    );
  }

  const user = `${documentType.value}${documentNumber.value}`;

  try {
    const cryptoService = new CryptoService();
    const response = await fetch(
      `${backApi}/products/v1/products?user=${encodeURIComponent(user)}`,
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

    console.log("Products backend raw response:", rawPayload);
    console.log("Products backend decrypted response:", payload);

    if (!response.ok) {
      return Response.json(
        {
          message:
            payload && typeof payload === "object" && "message" in payload
              ? String(payload.message)
              : "No fue posible cargar los productos.",
        },
        { status: response.status },
      );
    }

    return Response.json({ products: normalizeProducts(payload) });
  } catch {
    return Response.json(
      { message: "No fue posible conectar con el servicio de productos." },
      { status: 502 },
    );
  }
}
