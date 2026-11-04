import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import categoriesRouter from './routes/categories.js';
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import variantsRouter from './routes/variants.js';

const app = express();
const port = process.env.PORT || 4000;

// Satu proxy di depan API (Vite saat lokal, Vercel saat deploy), agar rate limit memakai IP asli.
app.set('trust proxy', 1);
app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/variants', variantsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});
