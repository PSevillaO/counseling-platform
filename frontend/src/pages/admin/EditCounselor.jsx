import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/adminService";
import userService from "../../services/userService";

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

export default function EditCounselor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    hourlyRate: "",
    specialties: [],
  });

  useEffect(() => {
    adminService
      .getCounselors()
      .then((data) => {
        const found = data.counselors.find((c) => c._id === id);
        if (!found) return navigate("/admin/counselors");
        setCounselor(found);
        setFormData({
          firstName: found.firstName || "",
          lastName: found.lastName || "",
          email: found.email || "",
          bio: found.counselorProfile?.bio || "",
          hourlyRate: found.counselorProfile?.hourlyRate || "",
          specialties: found.counselorProfile?.specialties || [],
        });
      })
      .catch(() => navigate("/admin/counselors"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
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
    setSuccess("");
    try {
      await adminService.updateCounselor(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        hourlyRate: Number(formData.hourlyRate),
        specialties: formData.specialties,
      });
      setSuccess("Counselor actualizado correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!confirm(`¿Resetear la contraseña de ${counselor.firstName}?`)) return;
    setResetting(true);
    try {
      await userService.resetPassword(id, newPassword);
      setResetSuccess(true);
      setNewPassword("");
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al resetear la contraseña.",
      );
    } finally {
      setResetting(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="text-orange-400">Cargando counselor...</div>
      </AdminLayout>
    );

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
          Editar counselor
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          {counselor?.firstName} {counselor?.lastName} · {counselor?.email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos personales */}
          <div className="bg-white rounded-2xl border border-orange-100 p-6">
            <h2 className="font-semibold text-stone-700 mb-4">
              Datos personales
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
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 border border-stone-100 rounded-lg text-sm bg-stone-50 text-stone-400 cursor-not-allowed"
              />
              <p className="text-xs text-stone-300 mt-1">
                El email no se puede modificar.
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
                rows={4}
                maxLength={500}
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

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              ✅ {success}
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

        {/* Resetear contraseña */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mt-4">
          <h2 className="font-semibold text-stone-700 mb-4">
            Resetear contraseña
          </h2>
          <div className="flex gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña (mín. 6 caracteres)"
              className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
            <button
              onClick={handleResetPassword}
              disabled={resetting}
              className="bg-stone-700 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {resetting ? "..." : "Resetear"}
            </button>
          </div>
          {resetSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mt-3">
              ✅ Contraseña reseteada correctamente.
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => navigate(`/admin/counselors/${id}/availability`)}
            className="bg-white rounded-2xl border border-orange-100 p-5 hover:border-orange-300 transition-colors text-left group"
          >
            <div className="text-2xl mb-2">🗓️</div>
            <div className="font-semibold text-stone-700 group-hover:text-orange-500 text-sm">
              Ver agenda
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Configurar disponibilidad
            </div>
          </button>
          <button
            onClick={() => navigate(`/admin/appointments?counselor=${id}`)}
            className="bg-white rounded-2xl border border-orange-100 p-5 hover:border-orange-300 transition-colors text-left group"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-stone-700 group-hover:text-orange-500 text-sm">
              Ver citas
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Historial de sesiones
            </div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
