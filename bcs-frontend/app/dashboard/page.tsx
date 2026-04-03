import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  DashboardScreen,
  type Product,
} from "@/components/dashboard-screen";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const sessionToken = cookieStore.get("session_token");

  if (!sessionToken?.value) {
    redirect("/");
  }

  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");

  if (!host) {
    return <DashboardScreen errorMessage="No fue posible resolver el host de la aplicacion." />;
  }

  const response = await fetch(`${protocol}://${host}/api/products`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | { products?: Product[]; message?: string }
    | null;

  if (!response.ok) {
    return (
      <DashboardScreen
        products={[]}
        errorMessage={payload?.message || "No fue posible cargar los productos."}
      />
    );
  }

  return <DashboardScreen products={payload?.products ?? []} />;
}
