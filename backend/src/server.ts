import app from "./app.js";
import config from "./config/env.js";

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  GlobeTrotter Backend API`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Listening on: http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default server;
