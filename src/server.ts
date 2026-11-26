import app from './app';
import { env } from './config/env';
import { verifyEmailConnection } from './services/email.service';

const startServer = async (): Promise<void> => {
  try {
    await verifyEmailConnection();

    const server = app.listen(env.PORT, () => {
      console.log(`Contact API running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    const shutdown = (signal: string): void => {
      console.log(`${signal} received. Shutting down...`);

      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });

      const forceExit = setTimeout(() => process.exit(1), 10000);
      forceExit.unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(
      'Failed to start contact API:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

void startServer();
