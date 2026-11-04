export function notFound(_req, res) {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
}

// Express butuh 4 parameter untuk mengenali error handler.
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
