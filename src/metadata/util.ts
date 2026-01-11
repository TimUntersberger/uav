export function cleanStr(s: string) {
  return (s || "").replace(/\0/g, "").trim();
}