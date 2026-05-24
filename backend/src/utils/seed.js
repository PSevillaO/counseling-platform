require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const counselors = [
  {
    firstName: "María",
    lastName: "González",
    email: "maria@contigo.com",
    password: "123456",
    role: "counselor",
    counselorProfile: {
      bio: "Especialista en acompañamiento durante procesos de duelo con un enfoque cálido y humanizado. Más de 5 años acompañando personas en sus momentos más difíciles.",
      specialties: ["Duelo y Pérdida", "Crisis emocional", "Ansiedad"],
      hourlyRate: 40,
      rating: 4.9,
      totalSessions: 47,
    },
  },
  {
    firstName: "Lucas",
    lastName: "Martínez",
    email: "lucas@contigo.com",
    password: "123456",
    role: "counselor",
    counselorProfile: {
      bio: "Acompaño a personas en el manejo del estrés y la ansiedad con herramientas prácticas y comprobadas. Enfoque orientado a resultados concretos.",
      specialties: ["Estrés", "Ansiedad", "Burnout laboral"],
      hourlyRate: 45,
      rating: 4.8,
      totalSessions: 62,
    },
  },
  {
    firstName: "Sofía",
    lastName: "Rodríguez",
    email: "sofia@contigo.com",
    password: "123456",
    role: "counselor",
    counselorProfile: {
      bio: "Especialista en dinámicas relacionales con un enfoque sistémico e integrador. Trabajo con parejas, familias e individuos en crisis vinculares.",
      specialties: ["Relaciones y Vínculos", "Parejas", "Familia"],
      hourlyRate: 42,
      rating: 4.9,
      totalSessions: 38,
    },
  },
  {
    firstName: "Daniel",
    lastName: "López",
    email: "daniel@contigo.com",
    password: "123456",
    role: "counselor",
    counselorProfile: {
      bio: "Acompaño cambios de vida con enfoque orientado al crecimiento y la resiliencia. Especializado en transiciones laborales, mudanzas y cambios de etapa.",
      specialties: [
        "Transiciones Vitales",
        "Crecimiento personal",
        "Crisis de identidad",
      ],
      hourlyRate: 38,
      rating: 4.7,
      totalSessions: 51,
    },
  },
  {
    firstName: "Valentina",
    lastName: "Torres",
    email: "valentina@contigo.com",
    password: "123456",
    role: "counselor",
    counselorProfile: {
      bio: "Me especializo en acompañar a jóvenes adultos en el proceso de autoconocimiento y construcción de identidad. Enfoque humanista y no directivo.",
      specialties: ["Autoestima", "Identidad", "Jóvenes adultos"],
      hourlyRate: 35,
      rating: 4.8,
      totalSessions: 29,
    },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Eliminar counselors existentes para no duplicar
    await User.deleteMany({ role: "counselor" });
    console.log("🗑️  Counselors anteriores eliminados");

    // Crear nuevos counselors
    for (const counselor of counselors) {
      await User.create(counselor);
      console.log(`✅ Creado: ${counselor.firstName} ${counselor.lastName}`);
    }

    console.log("🎉 Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error.message);
    process.exit(1);
  }
};

seed();
