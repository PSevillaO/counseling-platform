require('dotenv').config()
const app = require("./app");
const { connectDB } = require("./config/database");
const logger = require("./config/logger");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en puerto ${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV}`);
  });
};

start();

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
  process.exit(1);
});
