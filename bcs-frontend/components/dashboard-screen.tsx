"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/app/actions/session";
import { encryptClientPayload } from "@/shared/encrypt-client";

export type Product = {
  type: string;
  title: string;
  amount: number;
  description: string;
  image: string;
  badge?: string;
};

const amountFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

type DashboardScreenProps = {
  products?: Product[];
  errorMessage?: string | null;
};

const EMPTY_PRODUCTS: Product[] = [];

export function DashboardScreen({
  products = EMPTY_PRODUCTS,
  errorMessage = null,
}: DashboardScreenProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string>(
    products[0]?.type ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleProductRequest() {
    if (!selectedProduct || isSubmitting) {
      return;
    }

    const selectedProductData = products.find(
      (product) => product.type === selectedProduct,
    );

    if (!selectedProductData) {
      setSubmitError("No fue posible identificar el producto seleccionado.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    try {
      const encryptedPayload = await encryptClientPayload({
        productType: selectedProduct,
        amount: selectedProductData.amount,
      });

      const response = await fetch("/api/product-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedPayload),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload?.message || "No fue posible solicitar el producto.",
        );
      }

      setSubmitMessage(
        payload?.message || "Solicitud registrada correctamente.",
      );
      router.push("/dashboard/productos-creados");
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible solicitar el producto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fafdff_0%,#f5f7fa_45%,#edf2f9_100%)] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/70 bg-white/75 p-8 shadow-[0_18px_55px_rgba(33,84,160,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1b6edc]">
                Portal Personas
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1a1a1a]">
                Inicie su solicitud aqui
              </h1>
            </div>
            <form action={logoutUser}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#d9e6f7] bg-white px-6 text-sm font-semibold text-[#1b4fae] transition hover:border-[#b7d0f3] hover:bg-[#f7fbff]"
              >
                Salir
              </button>
            </form>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#b42318]">
            {errorMessage}
          </p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fafdff_0%,#f5f7fa_45%,#edf2f9_100%)] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/70 bg-white/75 p-8 shadow-[0_18px_55px_rgba(33,84,160,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1b6edc]">
                Portal Personas
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1a1a1a]">
                Inicie su solicitud aqui
              </h1>
            </div>
            <form action={logoutUser}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#d9e6f7] bg-white px-6 text-sm font-semibold text-[#1b4fae] transition hover:border-[#b7d0f3] hover:bg-[#f7fbff]"
              >
                Salir
              </button>
            </form>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6b7280]">
            No hay productos disponibles para este usuario en este momento.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fafdff_0%,#f5f7fa_45%,#edf2f9_100%)] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_55px_rgba(33,84,160,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1b6edc]">
                Portal Personas
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#1a1a1a] sm:text-[2.7rem]">
                Inicie su solicitud aqui
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#6b7280]">
                Elija el tipo de producto que necesita y continue con su
                proceso desde una experiencia simple y guiada.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#dbe8ff] bg-[#e7f0ff] px-5 py-4 text-[#1b4fae] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                    Seleccion actual
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                    {products.find((product) => product.type === selectedProduct)?.title}
                  </p>
                </div>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#b7d0f3] bg-white px-6 text-sm font-semibold text-[#1b4fae] transition hover:border-[#8fb6eb] hover:bg-[#f7fbff]"
                  >
                    Salir
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 mt-6 flex justify-start">
          <Link
              href="/dashboard/productos-creados"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1b6edc] px-8 text-base font-semibold text-white shadow-[0_14px_30px_rgba(27,110,220,0.28)] transition duration-200 ease-in-out hover:bg-[#175fbe]"
          >
            Ver productos creados
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const isSelected = product.type === selectedProduct;

            return (
              <button
                key={product.type}
                type="button"
                onClick={() => setSelectedProduct(product.type)}
                className={`group relative overflow-hidden rounded-[24px] border bg-white p-5 text-left shadow-[0_16px_40px_rgba(20,45,90,0.08)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(27,110,220,0.14)] focus:outline-none focus:ring-4 focus:ring-[#d7e7ff] ${
                  isSelected
                    ? "border-[#1b6edc] shadow-[0_18px_48px_rgba(27,110,220,0.18)]"
                    : "border-[#e6edf7] hover:border-[#8ab3ef]"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1b6edc] via-[#4a8ff0] to-[#d9e7ff]" />

                {product.badge ? (
                  <span className="mb-4 inline-flex rounded-full bg-[#e7f0ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1b6edc]">
                    {product.badge}
                  </span>
                ) : (
                  <div className="mb-4 h-[26px]" />
                )}

                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f3f8ff] ring-1 ring-[#dbe8ff]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1a1a1a]">
                          {product.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                          {product.description}
                        </p>
                      </div>

                      <span
                        className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                          isSelected
                            ? "border-[#1b6edc] bg-[#1b6edc]"
                            : "border-[#cdd9ea] bg-white"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isSelected ? "bg-white" : "bg-transparent"
                          }`}
                        />
                      </span>
                    </div>

                    <div className="rounded-2xl bg-[#f7faff] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8da3]">
                        Monto estimado
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1b4fae]">
                        {amountFormatter.format(product.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_45px_rgba(25,57,110,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
                Producto seleccionado
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#1a1a1a]">
                {products.find((product) => product.type === selectedProduct)?.title}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[280px]">
              <button
                type="button"
                onClick={() => {
                  void handleProductRequest();
                }}
                disabled={isSubmitting}
                className="inline-flex h-13 items-center justify-center rounded-full bg-[#1b6edc] px-8 text-base font-semibold text-white shadow-[0_14px_30px_rgba(27,110,220,0.28)] transition duration-200 ease-in-out hover:bg-[#175fbe] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Solicitando..." : "Solicitar producto"}
              </button>
              <button
                type="button"
                className="text-sm font-semibold text-[#1b6edc] underline-offset-4 transition hover:underline"
              >
                Retomar solicitud
              </button>
              {submitError ? (
                <p className="text-sm text-[#b42318]">{submitError}</p>
              ) : null}
              {submitMessage ? (
                <p className="text-sm text-[#1f7a3d]">{submitMessage}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
