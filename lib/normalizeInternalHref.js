const INTERNAL_HOSTS = new Set(['destinasian.co.id', 'www.destinasian.co.id'])

export function normalizeInternalHref(href) {
  if (typeof href !== 'string') return '/'

  const value = href.trim()
  if (!value) return '/'

  // Keep relative and anchor/query hrefs untouched.
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('?')) {
    return value
  }

  try {
    const url = new URL(value)

    if (INTERNAL_HOSTS.has(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}` || '/'
    }

    return value
  } catch {
    // Non-URL values are returned as-is.
    return value
  }
}
