export type UUID = string & { _tag?: "uuid" };

export default function generateUUID(): UUID {
  // Check if crypto.randomUUID is available (Node.js 15+, modern browsers)
  if (typeof crypto === "object" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
