import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import healthRouter from './routes/health.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';
import portfolioRouter from './routes/portfolio.js';
import articlesRouter from './routes/articles.js';
import productsRouter from './routes/products.js';
import servicesRouter from './routes/services.js';
import coursesRouter from './routes/courses.js';
import settingsRouter from './routes/settings.js';
import contentRouter from './routes/content.js';
import prototypesRouter from './routes/prototypes.js';
import prototypeServeRouter from './routes/prototypeServe.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRouter);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/products', productsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/content', contentRouter);
app.use('/api/prototypes', prototypesRouter);

// Public, password-gated hosting of uploaded prototype sites.
app.use('/p', prototypeServeRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export default app;
