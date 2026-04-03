import type { ReactNode } from "react";
import Image from "next/image";

function BankLogo() {
  return (
    <div className="text-[#1665c1]">
      <Image
        src="/logoBCSLine.svg"
        alt="Logo Banco Caja Social"
        width={221}
        height={50}
        priority
        className="h-auto w-[180px] sm:w-[221px]"
      />
    </div>
  );
}

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f5f6f7]">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="relative min-h-[36vh] md:min-h-screen">
          <Image
            src="/fondo.png"
            alt="Madre con nino en sofa usando un laptop"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[18%_center]"
          />
        </section>

        <section className="flex bg-[#f5f6f7]">
          <div className="mx-auto flex w-full max-w-[520px] flex-col justify-center px-6 py-12 sm:px-8 md:px-10 md:-translate-y-6">
            <div className="space-y-10">
              <BankLogo />
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
