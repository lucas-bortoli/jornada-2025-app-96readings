export type UUID<Tag = any> = string & { _tag?: "uuid"; _tag2?: Tag };

export default function generateUUID<ID extends UUID = UUID>(): ID {
  // Check if crypto.randomUUID is available (Node.js 15+, modern browsers)
  if (typeof crypto === "object" && "randomUUID" in crypto) {
    return crypto.randomUUID() as ID;
  }

  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as ID;
}
