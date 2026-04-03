"use client";

import { useState } from "react";
import { DocumentType } from "@/lib/document-type";

type RegisterFormValues = {
  documentType: DocumentType;
  documentNumber: string;
  username: string;
  password: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const initialValues: RegisterFormValues = {
  documentType: DocumentType.CC,
  documentNumber: "",
  username: "",
  password: "",
};

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  function validate(nextValues: RegisterFormValues) {
    const nextErrors: RegisterFormErrors = {};

    if (!nextValues.documentType) {
      nextErrors.documentType = "El tipo de documento es obligatorio.";
    }

    if (!nextValues.documentNumber.trim()) {
      nextErrors.documentNumber = "El numero de documento es obligatorio.";
    }

    if (!nextValues.username.trim()) {
      nextErrors.username = "El nombre de usuario es obligatorio.";
    }

    if (!nextValues.password.trim()) {
      nextErrors.password = "La contrasena es obligatoria.";
    }

    return nextErrors;
  }

  function handleChange(field: keyof RegisterFormValues, value: string) {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
