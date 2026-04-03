import { cookies } from "next/headers";
import { CryptoService } from "@/shared/encrypt";

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

export async function POST(request: Request) {
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

  const rawBody = (await request.json().catch(() => null)) as
    | EncryptedPayload
    | { productType?: string; amount?: number }
    | null;
  const cryptoService = new CryptoService();
  const body = (isEncryptedPayload(rawBody)
    ? cryptoService.decrypt(rawBody)
    : rawBody) as { productType?: string; amount?: number } | null;

  if (!body?.productType) {
    return Response.json(
      { message: "Debe seleccionar un producto." },
      { status: 400 },
    );
  }

  if (typeof body.amount !== "number" || body.amount < 1) {
    return Response.json(
      { message: "El monto del producto es invalido." },
      { status: 400 },
    );
  }

  try {
    const user = `${documentType.value}${documentNumber.value}`;
    const payload = {
      productType: body.productType,
      user,
      amount: body.amount,
      term: 24,
    };
    const encryptedPayload = cryptoService.encrypt(payload);

    console.log("Product registration client payload:", body);
    console.log("Product registration payload:", payload);
    console.log("Product registration encrypted payload:", encryptedPayload);

    const response = await fetch(`${backApi}/products/v1/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken.value}`,
      },
      body: JSON.stringify(encryptedPayload),
      cache: "no-store",
    });

    const rawPayload = await response.json().catch(() => null);
    const payloadResponse = isEncryptedPayload(rawPayload)
      ? cryptoService.decrypt(rawPayload)
      : rawPayload;

    console.log("Product registration raw response:", rawPayload);
    console.log("Product registration decrypted response:", payloadResponse);

    if (!response.ok) {
      return Response.json(
        {
          message:
            payloadResponse &&
            typeof payloadResponse === "object" &&
            "message" in payloadResponse
              ? String(payloadResponse.message)
              : "No fue posible solicitar el producto.",
        },
        { status: response.status },
      );
    }

    return Response.json(
      {
        message:
          payloadResponse &&
          typeof payloadResponse === "object" &&
          "message" in payloadResponse
            ? String(payloadResponse.message)
            : "Solicitud registrada correctamente.",
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { message: "No fue posible conectar con el servicio de solicitud." },
      { status: 502 },
    );
  }
}
