import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/adminService";

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

export default function CreateCounselor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
    hourlyRate: "",
    specialties: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSaving(true);
    try {
      await adminService.createCounselor({
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
      });
      navigate("/admin/counselors");
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el counselor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <button
          onClick={() => navigate("/admin/counselors")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver a counselors
        </button>

        <h1 className="text-2xl font-bold text-stone-800 mb-1">
          Nuevo counselor
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Completá los datos para dar de alta un counselor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos de acceso */}
          <div className="bg-white rounded-2xl border border-orange-100 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">
              Datos de acceso
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
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
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Contraseña inicial
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
              <p className="text-xs text-stone-300 mt-1">
                El counselor podrá cambiarla desde su perfil.
              </p>
            </div>
          </div>

          {/* Perfil profesional */}
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
                rows={3}
                maxLength={500}
                placeholder="Descripción del counselor..."
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
              />
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
                placeholder="Ej: 45"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
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
            {saving ? "Creando counselor..." : "Crear counselor"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
