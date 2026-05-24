const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI no está definida en variables de entorno");
    }

    await mongoose.connect(MONGODB_URI);

    logger.info("Conexión a MongoDB exitosa");

    mongoose.connection.on("disconnected", () => {
      logger.warn("Desconectado de MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("Error de conexión MongoDB", { error: err.message });
    });
  } catch (error) {
    logger.error("Error conectando a MongoDB", { error: error.message });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info("Desconectado de MongoDB");
};

module.exports = { connectDB, disconnectDB };
