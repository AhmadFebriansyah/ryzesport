export function notFound(_req, res) {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
}

// Express butuh 4 parameter untuk mengenali error handler.
export function errorHandler(err, _req, res, _next) {
  // Error dari klien, misalnya body JSON yang rusak.
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: 'Permintaan tidak valid.' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
