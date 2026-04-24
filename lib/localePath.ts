/** Absolute app path for this locale, e.g. `en` + `/cabins` → `/en/cabins`. */
export function withLocalePath(locale: string, path: string): string {
  if (path === "/") {
    return `/${locale}`;
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p}`;
}
