import { cookies } from "next/headers";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");
  const documentType = cookieStore.get("session_document_type");
  const documentNumber = cookieStore.get("session_document_number");
  const backApi = process.env.BACKENDAPI;

  if (!sessionToken?.value || !documentType?.value || !documentNumber?.value) {
    return Response.json(
      { message: "Sesion invalida o incompleta." },
      { status: 401 },
    );
  }

  if (!backApi) {
    return Response.json(
      { message: "La variable de entorno BACKENDAPI no esta configurada." },
      { status: 500 },
    );
  }

  if (!id) {
    return Response.json(
      { message: "El identificador del producto es obligatorio." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${backApi}/products/v1/delete/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken.value}`,
        },
        cache: "no-store",
      },
    );

    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    if (!response.ok) {
      return Response.json(
        {
          message:
            payload?.message || "No fue posible eliminar el producto creado.",
        },
        { status: response.status },
      );
    }

    return Response.json(
      {
        message: payload?.message || "Producto eliminado correctamente.",
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { message: "No fue posible conectar con el servicio de productos." },
      { status: 502 },
    );
  }
}
