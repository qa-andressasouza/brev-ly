/**
 * Constrói a URL encurtada completa (domínio do front-end + alias).
 */
export function buildShortUrl(shortUrl: string): string {
  let base = import.meta.env.VITE_FRONTEND_URL ?? window.location.origin
  if (base.endsWith('/')) {
    base = base.slice(0, -1)
  }
  return `${base}/${shortUrl}`
}

/**
 * Versão "amigável" (sem protocolo) para exibir na listagem.
 */
export function formatShortUrl(shortUrl: string): string {
  return buildShortUrl(shortUrl).replace('https://', '').replace('http://', '')
}
