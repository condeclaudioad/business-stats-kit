import { cookies } from "next/headers";
import { authConfig, isDemo, sessionCookie } from "./config";
import { validSession } from "./store";
export { isDemo } from "./config";
export const noStore = { "cache-control": "no-store" };
export function cookieValue(req: Request, name: string): string | undefined {
  return req.headers
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
export async function requireSession(req: Request): Promise<Response | null> {
  if (isDemo()) return null;
  try {
    authConfig();
    return (await validSession(cookieValue(req, sessionCookie())))
      ? null
      : Response.json(
          { error: "Iniciá sesión." },
          { status: 401, headers: noStore },
        );
  } catch {
    return Response.json(
      { error: "Acceso no configurado o temporalmente no disponible." },
      { status: 503, headers: noStore },
    );
  }
}
export async function hasSession(): Promise<boolean> {
  if (isDemo()) return true;
  try {
    authConfig();
    return await validSession((await cookies()).get(sessionCookie())?.value);
  } catch {
    return false;
  }
}
export function checkOrigin(req: Request): boolean {
  return (
    req.headers.get("origin") === authConfig().origin &&
    req.headers.get("sec-fetch-site") !== "cross-site"
  );
}
