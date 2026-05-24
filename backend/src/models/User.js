const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
      maxlength: [50, "El apellido no puede tener más de 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // nunca se devuelve en queries por defecto
    },
    role: {
      type: String,
      enum: ["client", "counselor", "admin"],
      default: "client",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Datos extra para counselors
    counselorProfile: {
      bio: { type: String, maxlength: 500 },
      specialties: [{ type: String }],
      hourlyRate: { type: Number },
      rating: { type: Number, default: 0 },
      totalSessions: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  },
);

// Hash de password antes de guardar
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para devolver datos públicos (sin password)
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    counselorProfile: this.counselorProfile,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
