"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import type { LoginActionState } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";
import { LoginSubmitButton } from "@/components/login-submit-button";
import { useLoginForm } from "@/hooks/use-login-form";
import { DocumentType } from "@/lib/document-type";

const initialLoginActionState: LoginActionState = {
  message: null,
};

export function LoginScreen() {
  return (
    <Suspense fallback={<LoginScreenContent registered={false} />}>
      <LoginScreenSearchParams />
    </Suspense>
  );
}

function LoginScreenSearchParams() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  return <LoginScreenContent registered={registered} />;
}

type LoginScreenContentProps = {
  registered: boolean;
};

function LoginScreenContent({ registered }: LoginScreenContentProps) {
  const { values, errors, handleChange, handleSubmit } = useLoginForm();
  const [state, formAction] = useActionState(
    loginUser,
    initialLoginActionState,
  );
  const errorAlertClass =
    "rounded-2xl border border-[#f3c7c2] bg-[#fff4f2] px-4 py-3 text-sm font-semibold text-[#b42318] shadow-[0_8px_20px_rgba(180,35,24,0.08)]";
  const successAlertClass =
    "rounded-2xl border border-[#b7e4c7] bg-[#effaf3] px-4 py-3 text-sm font-semibold text-[#136c37] shadow-[0_8px_20px_rgba(19,108,55,0.08)]";

  return (
    <AuthShell>
      <div className="space-y-5">
        <div className="space-y-4">
          <h1 className="max-w-[320px] text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#23272f] sm:text-[2.8rem]">
            Bienvenido al Portal Personas
          </h1>
          <p className="max-w-[390px] text-base leading-7 text-[#5f6673]">
            Recuerde que su usuario esta compuesto por su Tipo de
            Identificacion (CC, CE, NI, TI, PE) y su Numero de Identificacion
            sin espacios, puntos ni comas.
          </p>
          {registered ? (
            <div className={successAlertClass}>
              Registro exitoso. Ahora puede iniciar sesion.
            </div>
          ) : null}
        </div>

        <form
          className="space-y-6"
          action={formAction}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-3">
            <label
              htmlFor="documentType"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Tipo de documento
            </label>
            <div className="space-y-2">
              <select
                id="documentType"
                name="documentType"
                value={values.documentType}
                onChange={(event) =>
                  handleChange("documentType", event.target.value)
                }
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.documentType)}
              >
                {Object.values(DocumentType).map((documentType) => (
                  <option key={documentType} value={documentType}>
                    {documentType}
                  </option>
                ))}
              </select>
              {errors.documentType ? (
                <div className={errorAlertClass}>{errors.documentType}</div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="usuario"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Usuario
            </label>
            <div className="space-y-2">
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ejemplo: CC1234567890"
                value={values.usuario}
                onChange={(event) => handleChange("usuario", event.target.value)}
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.usuario)}
              />
              <p className="text-sm text-[#6e87a6]">Ejemplo: CC1234567890</p>
              {errors.usuario ? (
                <div className={errorAlertClass}>{errors.usuario}</div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="contrasena"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Contrasena
            </label>
            <div className="space-y-2">
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                placeholder="Ingrese su contrasena"
                value={values.contrasena}
                onChange={(event) =>
                  handleChange("contrasena", event.target.value)
                }
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.contrasena)}
              />
              {errors.contrasena ? (
                <div className={errorAlertClass}>{errors.contrasena}</div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <LoginSubmitButton />
          </div>

          {state.message ? (
            <div className={errorAlertClass}>{state.message}</div>
          ) : null}
        </form>

        <div className="space-y-6 pt-7">
          <div className="h-px bg-[#e4e8ee]" />
          <p className="text-base text-[#3d4350]">
            Es un cliente nuevo?{" "}
            <Link
              href="/registrarse"
              className="font-semibold text-[#2b6cb0] underline-offset-4 hover:underline"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
