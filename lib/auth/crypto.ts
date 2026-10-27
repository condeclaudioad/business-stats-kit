import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
export const hashToken = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");
export const equalText = (a: string, b: string) =>
  timingSafeEqual(
    Buffer.from(hashToken(a), "hex"),
    Buffer.from(hashToken(b), "hex"),
  );
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algorithm, salt, digest] = stored.split("$");
  if (
    algorithm !== "scrypt-v1" ||
    !/^[a-f0-9]{32}$/.test(salt ?? "") ||
    !/^[a-f0-9]{64}$/.test(digest ?? "")
  )
    return false;
  if (password.length > 1024) return false;
  const result = await new Promise<Buffer>((resolve, reject) =>
    nodeScrypt(
      password,
      Buffer.from(salt, "hex"),
      32,
      { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
  return timingSafeEqual(result, Buffer.from(digest, "hex"));
}
