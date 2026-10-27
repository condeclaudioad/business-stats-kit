import { readFile } from "node:fs/promises";
import { validateImport } from "../lib/import-validation";
import { storeEvents } from "../lib/import-store";
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL");
  const file = process.argv[2];
  if (!file) throw new Error("Uso: npm run data:import -- archivo.json");
  const text = await readFile(file, "utf8");
  if (Buffer.byteLength(text) > 5_000_000) throw new Error("Máximo 5 MB");
  const data = validateImport(JSON.parse(text));
  await storeEvents(process.env.DATABASE_URL, data);
  console.log(
    `Importación ${data.source} aplicada: ${data.events.length} eventos procesados; IDs existentes conservados.`,
  );
}
main().catch(() => {
  console.error(
    "Importación rechazada. Revisá formato, esquema y conexión. No se muestran credenciales.",
  );
  process.exitCode = 1;
});
