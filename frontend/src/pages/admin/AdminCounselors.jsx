import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/adminService";

export default function AdminCounselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .getCounselors()
      .then((data) => setCounselors(data.counselors))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const data = await adminService.toggleCounselor(id);
      setCounselors((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isActive: data.counselor.isActive } : c,
        ),
      );
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al actualizar el counselor.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Counselors</h1>
        <p className="text-stone-400 text-sm mt-1">
          Gestioná los counselors de la plataforma.
        </p>
      </div>

      {loading ? (
        <div className="text-orange-400">Cargando counselors...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Counselor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Especialidades
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Sesiones
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {counselors.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center font-bold text-orange-400 text-sm">
                        {c.firstName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-stone-800 text-sm">
                          {c.firstName} {c.lastName}
                        </div>
                        <div className="text-xs text-stone-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.counselorProfile?.specialties?.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full border border-orange-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {c.counselorProfile?.totalSessions || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${
                        c.isActive
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-400 border-red-100"
                      }`}
                    >
                      {c.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(c._id)}
                        disabled={toggling === c._id}
                        className={`text-xs font-medium transition-colors disabled:opacity-50 ${
                          c.isActive
                            ? "text-red-400 hover:text-red-600"
                            : "text-green-500 hover:text-green-700"
                        }`}
                      >
                        {toggling === c._id
                          ? "..."
                          : c.isActive
                            ? "Desactivar"
                            : "Activar"}
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/counselors/${c._id}/availability`)
                        }
                        className="text-xs text-orange-400 font-medium hover:text-orange-600 transition-colors"
                      >
                        Agenda
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
