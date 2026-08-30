export const SITE_URL = "https://trouvemonvol.fr";
export const SITE_NAME = "TrouveMonVol";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl("/og/default.jpg");

export function destinationOgImage(slug: string): string {
  return absoluteUrl(`/og/${slug}.jpg`);
}
