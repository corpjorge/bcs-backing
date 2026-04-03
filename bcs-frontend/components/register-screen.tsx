"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { registerUser } from "@/app/registrarse/actions";
import type { RegisterActionState } from "@/app/registrarse/actions";
import { RegisterSubmitButton } from "@/components/register-submit-button";
import { useRegisterForm } from "@/hooks/use-register-form";
import { DocumentType } from "@/lib/document-type";

const initialRegisterActionState: RegisterActionState = {
  message: null,
};

export function RegisterScreen() {
  const { values, errors, handleChange, handleSubmit } = useRegisterForm();
  const [state, formAction] = useActionState(
    registerUser,
    initialRegisterActionState,
  );

  return (
    <AuthShell>
      <div className="space-y-5">
        <div className="space-y-4">
          <h1 className="max-w-[320px] text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#23272f] sm:text-[2.8rem]">
            Registro de usuario
          </h1>
          <p className="max-w-[390px] text-base leading-7 text-[#5f6673]">
            Complete los datos para crear su acceso al Portal Personas.
          </p>
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
                <p className="text-sm text-[#ce0e2d]">{errors.documentType}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="documentNumber"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Numero de documento
            </label>
            <div className="space-y-2">
              <input
                id="documentNumber"
                name="documentNumber"
                type="number"
                placeholder="123451016"
                value={values.documentNumber}
                onChange={(event) =>
                  handleChange("documentNumber", event.target.value)
                }
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.documentNumber)}
              />
              {errors.documentNumber ? (
                <p className="text-sm text-[#ce0e2d]">{errors.documentNumber}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="username"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Nombre de usuario
            </label>
            <div className="space-y-2">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Alvaro Castro"
                value={values.username}
                onChange={(event) => handleChange("username", event.target.value)}
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.username)}
              />
              {errors.username ? (
                <p className="text-sm text-[#ce0e2d]">{errors.username}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-[#2f3440]"
            >
              Contrasena
            </label>
            <div className="space-y-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="***"
                value={values.password}
                onChange={(event) => handleChange("password", event.target.value)}
                className="h-14 w-full rounded-2xl border border-[#cad4e2] bg-white px-4 text-base text-[#23272f] outline-none transition focus:border-[#7a9dc8] focus:ring-4 focus:ring-[#d8e4f2]"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password ? (
                <p className="text-sm text-[#ce0e2d]">{errors.password}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <RegisterSubmitButton />
          </div>

          {state.message ? (
            <p className="text-sm text-[#ce0e2d]">{state.message}</p>
          ) : null}
        </form>

        <div className="space-y-6 pt-7">
          <div className="h-px bg-[#e4e8ee]" />
          <p className="text-base text-[#3d4350]">
            Ya tiene una cuenta?{" "}
            <Link
              href="/"
              className="font-semibold text-[#2b6cb0] underline-offset-4 hover:underline"
            >
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
