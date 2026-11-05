// Foto Unsplash bisa diminta lebih tajam untuk zoom. Foto lokal hanya punya satu ukuran.
export function fotoBesar(url) {
  return url.startsWith('https://images.unsplash.com/') ? url.replace('&w=900', '&w=2000') : url;
}
