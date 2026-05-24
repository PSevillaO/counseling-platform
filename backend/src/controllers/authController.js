const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una cuenta con ese email.",
      });
    }

    const allowedRoles = ["client", "counselor"];
    const userRole = allowedRoles.includes(role) ? role : "client";

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: userRole,
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: "Cuenta creada exitosamente.",
      token,
      refreshToken,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la cuenta.",
      error: error.message,
      stack: error.stack,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: "Login exitoso.",
      token,
      refreshToken,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
};

module.exports = { register, login, getMe };
