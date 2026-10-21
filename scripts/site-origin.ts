export function siteOrigin(value: string | undefined): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'SITE_URL deve ser uma origem HTTPS sem credenciais, caminho, query ou fragmento.',
    );
  return url.origin;
}
