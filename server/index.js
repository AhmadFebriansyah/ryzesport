import 'dotenv/config';
import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import categoriesRouter from './routes/categories.js';
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import variantsRouter from './routes/variants.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/variants', variantsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`);
});
