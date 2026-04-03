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

function sanitizeRegisterValues(values: RegisterFormValues) {
  return {
    documentType: values.documentType,
    documentNumber: values.documentNumber,
    username: values.username,
    passwordLength: values.password.length,
  };
}

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
    console.log("[register-form] handleChange", {
      field,
      value: field === "password" ? `[length:${value.length}]` : value,
    });

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
    console.log("[register-form] submit", {
      values: sanitizeRegisterValues(values),
      errors: nextErrors,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      console.warn("[register-form] prevented submit due to validation errors");
      event.preventDefault();
      return false;
    }

    console.log("[register-form] validation passed, submitting form");
    return true;
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
