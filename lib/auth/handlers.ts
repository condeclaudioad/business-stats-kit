import { NextResponse } from "next/server";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
  type AuthenticatorTransport,
} from "@simplewebauthn/server";
import { authConfig, cookieOptions, flowCookie, sessionCookie } from "./config";
import { checkOrigin, cookieValue, noStore } from "./guard";
import { equalText, hashToken, newToken, verifyPassword } from "./crypto";
import { pool, reserveAttempt, transaction } from "./store";
const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: noStore });
class Rejected extends Error {
  constructor(public status = 401) {
    super("Rejected");
  }
}
async function body(req: Request) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw new Rejected(415);
  if (Number(req.headers.get("content-length") ?? 0) > 32768)
    throw new Rejected(413);
  const reader = req.body?.getReader();
  if (!reader) throw new Rejected(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) {
      await reader.cancel();
      throw new Rejected(413);
    }
    chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    return parsed;
  } catch {
    throw new Rejected(400);
  }
}
export function endpoint(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    try {
      authConfig();
      if (!checkOrigin(req))
        return reply({ error: "Origen no permitido." }, 403);
      return await handler(req);
    } catch (error) {
      if (error instanceof Rejected)
        return reply(
          {
            error:
              error.status === 429
                ? "Demasiados intentos. Esperá 15 minutos."
                : "No se pudo completar el acceso. Volvé a empezar.",
          },
          error.status,
        );
      // Never send database connection strings, provider details or submitted data to logs/browser.
      return reply(
        { error: "Acceso no configurado o temporalmente no disponible." },
        503,
      );
    }
  };
}
export const login = endpoint(async (req) => {
  if (!(await reserveAttempt())) throw new Rejected(429);
  const b = await body(req);
  if (
    typeof b.username !== "string" ||
    typeof b.password !== "string" ||
    b.username.length > 200 ||
    b.password.length > 1024
  )
    throw new Rejected();
  const { rows } = await pool().query("SELECT * FROM stats_auth.owner");
  const owner = rows[0];
  if (
    !owner ||
    !(await verifyPassword(b.password, owner.password_hash)) ||
    !equalText(b.username, owner.username)
  )
    throw new Rejected();
  const token = newToken();
  const kind = await transaction(async (db) => {
    const {
      rows: [current],
    } = await db.query(
      "SELECT *, bootstrap_expires>now() AS bootstrap_valid FROM stats_auth.owner FOR UPDATE",
    );
    if (!current || current.version !== owner.version) throw new Rejected();
    const registration = Boolean(current.bootstrap_hash);
    if (
      registration &&
      (!current.bootstrap_valid ||
        typeof b.bootstrapToken !== "string" ||
        !equalText(hashToken(b.bootstrapToken), current.bootstrap_hash))
    )
      throw new Rejected();
    const kind = registration ? "register" : "authenticate";
    await db.query("DELETE FROM stats_auth.flows WHERE expires<=now()");
    await db.query("DELETE FROM stats_auth.sessions WHERE expires<=now()");
    await db.query(
      "INSERT INTO stats_auth.flows(token_hash,owner_version,kind,expires) VALUES($1,$2,$3,now()+interval '5 minutes')",
      [hashToken(token), owner.version, kind],
    );
    return kind;
  });
  const response = reply({ kind });
  response.cookies.set(flowCookie(), token, cookieOptions(300));
  return response;
});
async function options(req: Request, kind: "register" | "authenticate") {
  const token = cookieValue(req, flowCookie());
  if (!token) throw new Rejected();
  const config = authConfig();
  const result = await transaction(async (db) => {
    const {
      rows: [flow],
    } = await db.query(
      "SELECT f.*,o.username FROM stats_auth.flows f JOIN stats_auth.owner o ON o.version=f.owner_version WHERE token_hash=$1 AND expires>now() AND kind=$2 FOR UPDATE OF f",
      [hashToken(token), kind],
    );
    if (!flow) throw new Rejected();
    const { rows: keys } = await db.query(
      "SELECT id,transports FROM stats_auth.passkeys WHERE owner_version=$1",
      [flow.owner_version],
    );
    const options =
      kind === "register"
        ? await generateRegistrationOptions({
            rpName: "Business Stats",
            rpID: config.rpID,
            userName: flow.username,
            userID: new Uint8Array(Buffer.from(flow.owner_version)),
            attestationType: "none",
            authenticatorSelection: {
              residentKey: "required",
              userVerification: "required",
            },
            excludeCredentials: keys.map((k) => ({
              id: k.id,
              transports: k.transports,
            })),
          })
        : await generateAuthenticationOptions({
            rpID: config.rpID,
            userVerification: "required",
            allowCredentials: keys.map((k) => ({
              id: k.id,
              transports: k.transports,
            })),
          });
    if (kind === "authenticate" && !keys.length) throw new Rejected();
    await db.query(
      "UPDATE stats_auth.flows SET challenge=$1 WHERE token_hash=$2",
      [options.challenge, hashToken(token)],
    );
    return options;
  });
  return reply(result);
}
export const registerOptions = endpoint((req) => options(req, "register"));
export const passkeyOptions = endpoint((req) => options(req, "authenticate"));
async function verify(req: Request, kind: "register" | "authenticate") {
  if (!(await reserveAttempt())) throw new Rejected(429);
  const b = await body(req),
    token = cookieValue(req, flowCookie());
  if (!token) throw new Rejected();
  const config = authConfig(),
    session = newToken();
  const success = await transaction(async (db) => {
    // Owner lock serializes reset, bootstrap consumption and credential counters.
    const {
      rows: [owner],
    } = await db.query(
      "SELECT *, bootstrap_expires>now() AS bootstrap_valid FROM stats_auth.owner FOR UPDATE",
    );
    const {
      rows: [flow],
    } = await db.query(
      "DELETE FROM stats_auth.flows WHERE token_hash=$1 AND expires>now() AND kind=$2 RETURNING *",
      [hashToken(token), kind],
    );
    if (!owner || !flow?.challenge || flow.owner_version !== owner.version)
      return false;
    try {
      if (kind === "register") {
        if (!owner.bootstrap_hash || !owner.bootstrap_valid) return false;
        const verified = await verifyRegistrationResponse({
          response: b as RegistrationResponseJSON,
          expectedChallenge: flow.challenge,
          expectedOrigin: config.origin,
          expectedRPID: config.rpID,
          requireUserVerification: true,
        });
        if (!verified.verified || !verified.registrationInfo.userVerified)
          return false;
        const c = verified.registrationInfo.credential;
        await db.query(
          "INSERT INTO stats_auth.passkeys(id,public_key,counter,transports,owner_version) VALUES($1,$2,$3,$4,$5)",
          [
            c.id,
            Buffer.from(c.publicKey).toString("base64url"),
            c.counter,
            JSON.stringify(c.transports ?? []),
            owner.version,
          ],
        );
        await db.query(
          "UPDATE stats_auth.owner SET bootstrap_hash=NULL,bootstrap_expires=NULL",
        );
        // Parallel flows started with the bootstrap token lose registration authority.
        await db.query("DELETE FROM stats_auth.flows WHERE kind='register'");
      } else {
        const {
          rows: [key],
        } = await db.query(
          "SELECT * FROM stats_auth.passkeys WHERE id=$1 AND owner_version=$2",
          [typeof b.id === "string" ? b.id : "", owner.version],
        );
        if (!key) return false;
        const verified = await verifyAuthenticationResponse({
          response: b as AuthenticationResponseJSON,
          expectedChallenge: flow.challenge,
          expectedOrigin: config.origin,
          expectedRPID: config.rpID,
          credential: {
            id: key.id,
            publicKey: new Uint8Array(Buffer.from(key.public_key, "base64url")),
            counter: Number(key.counter),
            transports: key.transports as AuthenticatorTransport[],
          },
          requireUserVerification: true,
        });
        if (!verified.verified || !verified.authenticationInfo.userVerified)
          return false;
        await db.query(
          "UPDATE stats_auth.passkeys SET counter=$1 WHERE id=$2",
          [verified.authenticationInfo.newCounter, key.id],
        );
      }
    } catch {
      return false;
    }
    await db.query(
      "INSERT INTO stats_auth.sessions(token_hash,owner_version,expires) VALUES($1,$2,now()+interval '8 hours')",
      [hashToken(session), owner.version],
    );
    return true;
  });
  if (!success) throw new Rejected();
  const response = reply({ ok: true });
  response.cookies.set(sessionCookie(), session, cookieOptions(8 * 3600));
  response.cookies.set(flowCookie(), "", cookieOptions(0));
  return response;
}
export const registerVerify = endpoint((req) => verify(req, "register"));
export const passkeyVerify = endpoint((req) => verify(req, "authenticate"));
export const logout = endpoint(async (req) => {
  const token = cookieValue(req, sessionCookie()),
    flow = cookieValue(req, flowCookie());
  if (token)
    await pool().query("DELETE FROM stats_auth.sessions WHERE token_hash=$1", [
      hashToken(token),
    ]);
  if (flow)
    await pool().query("DELETE FROM stats_auth.flows WHERE token_hash=$1", [
      hashToken(flow),
    ]);
  const response = reply({ ok: true });
  response.cookies.set(sessionCookie(), "", cookieOptions(0));
  response.cookies.set(flowCookie(), "", cookieOptions(0));
  return response;
});
