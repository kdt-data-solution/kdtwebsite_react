export function parseJsonList(value, fallback = []) {
  let normalized = value;

  for (let depth = 0; depth < 6 && typeof normalized === 'string'; depth += 1) {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      return fallback;
    }
  }

  return Array.isArray(normalized) ? normalized : fallback;
}
