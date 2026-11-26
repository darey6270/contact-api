import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import contactRoutes from './routes/contact.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: env.CLIENT_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact API is running'
  });
});

app.use('/api/contact', contactRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorMiddleware);

export default app;
