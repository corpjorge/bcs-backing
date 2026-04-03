"use client";

import { useFormStatus } from "react-dom";

export function RegisterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-[#b9c9da] px-9 text-lg font-semibold text-[#314866] transition hover:bg-[#aabfd5] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Registrando..." : "Registrarse"}
    </button>
  );
}
