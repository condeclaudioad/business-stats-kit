export const isDemo = () => process.env.APP_MODE === "demo";
export function authConfig() {
  if (process.env.APP_MODE !== "live")
    throw new Error("Live mode is not configured");
  const raw = process.env.APP_ORIGIN;
  if (!raw || !process.env.DATABASE_URL)
    throw new Error("Auth configuration incomplete");
  const url = new URL(raw);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    url.origin !== raw ||
    url.username ||
    url.password ||
    (url.protocol !== "https:" && !(url.protocol === "http:" && local))
  )
    throw new Error(
      "APP_ORIGIN must be an exact HTTPS origin (HTTP localhost allowed)",
    );
  return {
    origin: url.origin,
    rpID: url.hostname,
    secure: url.protocol === "https:",
  };
}
export const sessionCookie = () =>
  authConfig().secure ? "__Host-stats_session" : "stats_session";
export const flowCookie = () =>
  authConfig().secure ? "__Host-stats_flow" : "stats_flow";
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: authConfig().secure,
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
