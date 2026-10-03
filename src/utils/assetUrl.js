/**
 * AEROPROOF Asset URL Resolver
 * Resolves static asset paths accurately across local dev, preview server, and GitHub Pages (/aeroproof/).
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // On GitHub Pages, ensure repository subpath prefix /aeroproof/ is present
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return `/aeroproof/${cleanPath}`;
  }

  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
