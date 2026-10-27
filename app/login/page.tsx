"use client";
import { useState, type FormEvent } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
async function post(path: string, body: object = {}) {
  const response = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error ?? "No se pudo completar el acceso.");
  return result;
}
export default function Login() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget,
      data = new FormData(form);
    try {
      const { kind } = await post("login", {
        username: data.get("username"),
        password: data.get("password"),
        bootstrapToken: data.get("bootstrapToken"),
      });
      (form.elements.namedItem("password") as HTMLInputElement).value = "";
      (form.elements.namedItem("bootstrapToken") as HTMLInputElement).value =
        "";
      if (kind === "register") {
        const optionsJSON = await post("register/options");
        const response = await startRegistration({ optionsJSON });
        await post("register/verify", response);
      } else {
        const optionsJSON = await post("passkey/options");
        const response = await startAuthentication({ optionsJSON });
        await post("passkey/verify", response);
      }
      window.location.assign("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">BUSINESS STATS</p>
        <h1>Tu negocio, en privado.</h1>
        <p>
          Entrá con tu contraseña y confirmá con tu passkey. Tu dispositivo
          puede pedir huella, rostro o PIN.
        </p>
        <form onSubmit={submit}>
          <label className="auth-label" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            maxLength={200}
          />
          <label className="auth-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={1024}
          />
          <details>
            <summary>Primer acceso o recuperación</summary>
            <label className="auth-label" htmlFor="bootstrapToken">
              Token de alta
            </label>
            <input
              id="bootstrapToken"
              name="bootstrapToken"
              type="password"
              autoComplete="off"
              maxLength={100}
            />
            <p>
              Lo genera auth:setup en tu terminal. Solo se usa para registrar la
              primera passkey.
            </p>
          </details>
          <p role="alert" aria-live="polite">
            {error}
          </p>
          <button type="submit" disabled={busy}>
            {busy ? "Confirmá en tu dispositivo…" : "Entrar con passkey"}
          </button>
        </form>
        <p>
          ¿Perdiste la passkey? Seguí la recuperación en docs/security.md. No
          existe registro público.
        </p>
      </section>
    </main>
  );
}
