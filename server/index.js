import app from './app.js';

const port = process.env.PORT || 4000;

// Express 5 mengirim kegagalan listen (misalnya port terpakai) ke callback ini.
app.listen(port, (err) => {
  if (err) {
    console.error(`API gagal berjalan di port ${port}:`, err.message);
    process.exit(1);
  }
  console.log(`API berjalan di http://localhost:${port}`);
});
