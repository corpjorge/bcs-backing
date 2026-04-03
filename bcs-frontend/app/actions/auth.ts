"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DocumentType } from "@/lib/document-type";
import { CryptoService } from "@/shared/encrypt";

export type LoginActionState = {
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

function extractJwtToken(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.token === "string") {
    return candidate.token;
  }

  if (typeof candidate.accessToken === "string") {
    return candidate.accessToken;
  }

  if (typeof candidate.access_token === "string") {
    return candidate.access_token;
  }

  if (typeof candidate.jwt === "string") {
    return candidate.jwt;
  }

  if (typeof candidate.data === "string") {
    return candidate.data;
  }

  return null;
}

export async function loginUser(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const backApi = process.env.BACKENDAPI;

  if (!backApi) {
    return {
      message: "La variable de entorno BACKENDAPI no esta configurada.",
    };
  }

  const documentType = String(formData.get("documentType") || "");
  const documentNumber = String(formData.get("usuario") || "").trim();
  const password = String(formData.get("contrasena") || "");

  console.log("[login-action] received login request", {
    backApi,
    documentType,
    documentNumber,
    passwordLength: password.length,
  });

  if (!Object.values(DocumentType).includes(documentType as DocumentType)) {
    return {
      message: "El tipo de documento seleccionado no es valido.",
    };
  }

  if (!documentNumber || !password) {
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

  let redirectToAuthenticated = false;

  try {
    const cryptoService = new CryptoService();
    const payload = {
      documentType,
      documentNumber: numericDocumentNumber,
      password,
    };
    console.log("[login-action] payload before encryption", {
      documentType,
      documentNumber: numericDocumentNumber,
      passwordLength: password.length,
    });
    const encryptedPayload = cryptoService.encrypt(payload);

    const response = await fetch(`${backApi}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedPayload),
      cache: "no-store",
    });

    const rawResponse = await response.json().catch(() => null);
    const decryptedResponse = isEncryptedPayload(rawResponse)
      ? cryptoService.decrypt(rawResponse)
      : rawResponse;

    console.log("[login-action] backend response", {
      status: response.status,
      ok: response.ok,
      rawResponse,
      decryptedResponse,
    });

    if (!response.ok) {
      return {
        message:
          decryptedResponse &&
          typeof decryptedResponse === "object" &&
          "message" in decryptedResponse
            ? String(decryptedResponse.message)
            : "No fue posible iniciar sesion.",
      };
    }

    const token = extractJwtToken(decryptedResponse);

    if (!token) {
      return {
        message: "Error de autenticaciÃ³n.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session_token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    cookieStore.set({
      name: "session_document_type",
      value: documentType,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    cookieStore.set({
      name: "session_document_number",
      value: documentNumber,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    redirectToAuthenticated = true;
  } catch (error) {
    console.error("[login-action] login request failed", error);
    return {
      message: "No fue posible conectar con el servicio de login.",
    };
  }

  if (redirectToAuthenticated) {
    redirect("/dashboard");
  }

  return {
    message: "No fue posible iniciar sesion.",
  };
}
