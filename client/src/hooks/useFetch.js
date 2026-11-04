import { useEffect, useState } from 'react';

async function fetchData(url, signal) {
  const response = await fetch(url, { signal });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? 'Gagal memuat data. Coba lagi nanti.');
  }
  return body.data;
}

// URL null berarti tidak ada yang perlu diambil.
export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null });

  useEffect(() => {
    if (!url) return undefined;

    const controller = new AbortController();

    fetchData(url, controller.signal)
      .then((data) => setResult({ url, data, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResult({ url, data: null, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  // Hasil milik URL lama dianggap belum ada, supaya data lama tidak tampil saat filter berganti.
  const isCurrent = result.url === url;
  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: Boolean(url) && !isCurrent,
  };
}
