"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieNames = [
  "session_token",
  "session_document_type",
  "session_document_number",
] as const;

export async function logoutUser() {
  const cookieStore = await cookies();

  for (const cookieName of sessionCookieNames) {
    cookieStore.delete(cookieName);
  }

  redirect("/");
}
