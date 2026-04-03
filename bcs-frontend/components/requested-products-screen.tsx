"use client";

import Link from "next/link";

type RequestedProduct = {
  id: string;
  productType: string;
  title: string;
  amount: number | null;
  term: number | null;
  status: string;
};

type RequestedProductsScreenProps = {
  products: RequestedProduct[];
  errorMessage?: string | null;
};

const amountFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function RequestedProductsScreen({
  products,
  errorMessage = null,
}: RequestedProductsScreenProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fafdff_0%,#f5f7fa_45%,#edf2f9_100%)] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_55px_rgba(33,84,160,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1b6edc]">
                Portal Personas
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1a1a1a] sm:text-[2.5rem]">
                Productos creados
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#6b7280]">
                Consulte el estado de las solicitudes que ya registro para sus
                productos financieros.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1b6edc] px-8 text-base font-semibold text-white shadow-[0_14px_30px_rgba(27,110,220,0.28)] transition duration-200 ease-in-out hover:bg-[#175fbe]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] border border-[#f3c7c2] bg-white/85 p-6 text-[#b42318] shadow-[0_16px_45px_rgba(25,57,110,0.08)]">
            {errorMessage}
          </div>
        ) : null}

        {!errorMessage && products.length === 0 ? (
          <div className="rounded-[24px] border border-white/80 bg-white/85 p-8 text-[#6b7280] shadow-[0_16px_45px_rgba(25,57,110,0.08)]">
            No hay productos creados para este usuario.
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(25,57,110,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8da3]">
                      {product.productType}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1a1a1a]">
                      {product.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#e7f0ff] px-4 py-2 text-sm font-semibold text-[#1b6edc]">
                    {product.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f7faff] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8da3]">
                      Monto
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#1b4fae]">
                      {product.amount !== null
                        ? amountFormatter.format(product.amount)
                        : "No disponible"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f7faff] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7f8da3]">
                      Termino
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[#1b4fae]">
                      {product.term !== null
                        ? `${product.term} meses`
                        : "No disponible"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
