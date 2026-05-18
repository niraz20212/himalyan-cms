const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

export function resolveMediaUrl(value) {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${backendBaseUrl}${normalizedPath}`;
}
