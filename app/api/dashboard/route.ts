import { requireSession } from "@/lib/auth/guard";
import { getDashboard } from "@/lib/dashboard";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const denied = await requireSession(request);
    if (denied) return denied;
    const days = Number(new URL(request.url).searchParams.get("days") ?? 30);
    if (![7, 30, 90].includes(days))
      return Response.json({ error: "Período inválido" }, { status: 400 });
    return Response.json(await getDashboard(days), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json(
      {
        error:
          "No se pudo cargar el tablero. Revisá la configuración del servidor.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
