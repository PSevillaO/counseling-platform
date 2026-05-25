const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
// Middleware manual CORS - va ANTES de todo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://espaciodeescucha.netlify.app')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://espaciodeescucha.netlify.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}))

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes, intentá más tarde.",
});
app.use("/api", limiter);

// ↓ RUTAS — agregar acá
app.use("/api/auth", require("./routes/auth"));
app.use("/api/counselors", require("./routes/counselors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/users", require("./routes/users"));
app.use("/api/availability", require("./routes/availability"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
