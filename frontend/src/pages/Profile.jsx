import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";

const SPECIALTIES_OPTIONS = [
  "Duelo y Pérdida",
  "Estrés",
  "Ansiedad",
  "Burnout laboral",
  "Relaciones y Vínculos",
  "Parejas",
  "Familia",
  "Transiciones Vitales",
  "Autoestima",
  "Identidad",
  "Jóvenes adultos",
  "Crisis emocional",
  "Crecimiento personal",
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isCounselor = user?.role === "counselor";

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.counselorProfile?.bio || "",
    hourlyRate: user?.counselorProfile?.hourlyRate || "",
    specialties: user?.counselorProfile?.specialties || [],
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError("");
  };

  const toggleSpecialty = (s) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(isCounselor && {
          bio: formData.bio,
          hourlyRate: Number(formData.hourlyRate),
          specialties: formData.specialties,
        }),
      };
      const data = await userService.updateProfile(payload);
      // Actualizar el usuario en localStorage
      updateUser(data.user) // ← reemplazar localStorage.setItem
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver al dashboard
        </button>

        <h1 className="text-3xl font-bold text-stone-800 mb-1">Mi perfil</h1>
        <p className="text-stone-400 text-sm mb-8">
          Editá tu información personal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos personales */}
          <div className="bg-white rounded-2xl border border-orange-100 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">
              Datos personales
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-2.5 border border-stone-100 rounded-lg text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
              />
              <p className="text-xs text-stone-300 mt-1">
                El email no se puede modificar.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Rol
              </label>
              <div className="px-4 py-2.5 border border-stone-100 rounded-lg text-sm bg-stone-50 text-stone-400 capitalize">
                {user?.role === "client" ? "👤 Cliente" : "🎓 Counselor"}
              </div>
            </div>
          </div>

          {/* Perfil de counselor */}
          {isCounselor && (
            <div className="bg-white rounded-2xl border border-orange-100 p-6">
              <h2 className="font-semibold text-stone-700 mb-4">
                Perfil profesional
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Contá sobre tu enfoque y experiencia..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                />
                <p className="text-xs text-stone-300 text-right">
                  {formData.bio.length}/500
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Precio por sesión (USD)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min={0}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  placeholder="Ej: 45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        formData.specialties.includes(s)
                          ? "bg-orange-400 text-white"
                          : "bg-orange-50 text-stone-500 border border-orange-100 hover:bg-orange-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              ✅ Perfil actualizado correctamente.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
