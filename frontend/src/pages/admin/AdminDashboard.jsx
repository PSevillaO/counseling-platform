import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStats()
      .then((data) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: "Counselors activos",
          value: `${stats.activeCounselors}/${stats.totalCounselors}`,
          icon: "🎓",
        },
        {
          label: "Clientes registrados",
          value: stats.totalClients,
          icon: "👤",
        },
        { label: "Total de citas", value: stats.totalAppointments, icon: "📅" },
        {
          label: "Citas confirmadas",
          value: stats.confirmedAppointments,
          icon: "✅",
        },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-stone-400 text-sm mt-1">
          Resumen general de la plataforma.
        </p>
      </div>

      {loading ? (
        <div className="text-orange-400">Cargando estadísticas...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-orange-100 p-5"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="text-3xl font-bold text-orange-400">
                {card.value}
              </div>
              <div className="text-sm text-stone-400 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
