"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { DocumentType } from "@/lib/document-type";

type LoginFormValues = {
  documentType: DocumentType;
  usuario: string;
  contrasena: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

const initialValues: LoginFormValues = {
  documentType: DocumentType.CC,
  usuario: "",
  contrasena: "",
};

export function useLoginForm() {
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  function validate(nextValues: LoginFormValues) {
    const nextErrors: LoginFormErrors = {};

    if (!nextValues.documentType) {
      nextErrors.documentType = "El tipo de documento es obligatorio.";
    }

    if (!nextValues.usuario.trim()) {
      nextErrors.usuario = "El usuario es obligatorio.";
    }

    if (!nextValues.contrasena.trim()) {
      nextErrors.contrasena = "La contraseña es obligatoria.";
    }

    return nextErrors;
  }

  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [field]: value.trim() ? undefined : currentErrors[field],
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
