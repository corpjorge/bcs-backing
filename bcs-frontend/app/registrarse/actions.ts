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

type ErrorPayload = {
  message?: unknown;
  error?: unknown;
  statusCode?: unknown;
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

function isErrorPayload(value: unknown): value is ErrorPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    "message" in candidate || "error" in candidate || "statusCode" in candidate
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

  console.log("[register-action] received registration request", {
    backApi,
    documentType,
    documentNumber,
    username,
    passwordLength: password.length,
  });

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
    console.log("[register-action] payload before encryption", {
      documentType,
      documentNumber: numericDocumentNumber,
      username,
      passwordLength: password.length,
    });
    const encryptedPayload = cryptoService.encrypt(payload);

    const response = await fetch(`${backApi}/users-api/v1/registration`, {
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

    console.log("[register-action] backend response", {
      status: response.status,
      ok: response.ok,
      rawResponse,
      decryptedResponse: data,
    });

    if (
      !response.ok ||
      (isErrorPayload(data) &&
        typeof data.statusCode === "number" &&
        data.statusCode >= 400)
    ) {
      return {
        message:
          data && typeof data === "object" && "message" in data
            ? String(data.message)
            : "No fue posible completar el registro.",
      };
    }
  } catch (error) {
    console.error("[register-action] registration request failed", error);
    return {
      message: "No fue posible conectar con el servicio de registro.",
    };
  }

  redirect("/?registered=1");
}
