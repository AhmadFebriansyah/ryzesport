import 'dotenv/config';
import express from 'express';
import healthRouter from './routes/health.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/health', healthRouter);

app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});
