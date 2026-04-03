"use server";

import { redirect } from "next/navigation";
import { DocumentType } from "@/lib/document-type";
import { CryptoService } from "@/shared/encrypt";

export type RegisterActionState = {
  message: string | null;
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

export async function registerUser(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const backApi = process.env.BACKENDAPI;

  if (!backApi) {
    return {
      message: "La variable de entorno BACKENDAPI no esta configurada.",
    };
  }

  const documentType = String(formData.get("documentType") || "");
  const documentNumber = String(formData.get("documentNumber") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!Object.values(DocumentType).includes(documentType as DocumentType)) {
    return {
      message: "El tipo de documento seleccionado no es valido.",
    };
  }

  if (!documentNumber || !username || !password) {
    return {
      message: "Todos los campos son obligatorios.",
    };
  }

  const numericDocumentNumber = Number(documentNumber);

  if (!Number.isFinite(numericDocumentNumber)) {
    return {
      message: "El numero de documento debe ser numerico.",
    };
  }

  try {
    const cryptoService = new CryptoService();
    const payload = {
      documentType,
      documentNumber: numericDocumentNumber,
      username,
      password,
    };
    const encryptedPayload = cryptoService.encrypt(payload);

    const response = await fetch(`${backApi}/products/v1/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedPayload),
      cache: "no-store",
    });

    const rawResponse = await response.json().catch(() => null);
    const data = isEncryptedPayload(rawResponse)
      ? cryptoService.decrypt(rawResponse)
      : rawResponse;

    if (!response.ok) {
      return {
        message:
          data && typeof data === "object" && "message" in data
            ? String(data.message)
            : "No fue posible completar el registro.",
      };
    }
  } catch {
    return {
      message: "No fue posible conectar con el servicio de registro.",
    };
  }

  redirect("/?registered=1");
}
