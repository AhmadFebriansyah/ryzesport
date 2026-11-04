export async function apiRequest(url, { method = 'GET', body, token } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(result?.message ?? 'Terjadi kesalahan. Coba lagi nanti.');
    error.status = response.status;
    throw error;
  }

  return result.data;
}
