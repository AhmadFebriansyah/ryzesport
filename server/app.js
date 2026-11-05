import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import brandsRouter from './routes/brands.js';
import cartRouter from './routes/cart.js';
import categoriesRouter from './routes/categories.js';
import healthRouter from './routes/health.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import variantsRouter from './routes/variants.js';

const app = express();

// Satu proxy di depan API (Vite saat lokal, Vercel saat deploy), agar rate limit memakai IP asli.
app.set('trust proxy', 1);
app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/variants', variantsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
