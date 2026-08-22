import app from './app';
import { env } from './config/env.config';
import { prisma } from './config/prisma.config';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('🔒 HTTP Server closed.');
    await prisma.$disconnect();
    console.log('🔌 Database disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
