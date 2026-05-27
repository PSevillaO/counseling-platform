import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import adminService from "../../services/adminService";
import TransferModal from "../../components/TransferModal";

const statusConfig = {
  confirmed: {
    label: "Confirmada",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  pending: {
    label: "Pendiente",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
  },
  completed: {
    label: "Completada",
    color: "bg-stone-50 text-stone-500 border-stone-100",
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-red-50 text-red-400 border-red-100",
  },
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [transferring, setTransferring] = useState(null);

  useEffect(() => {
    adminService
      .getAllAppointments()
      .then((data) => setAppointments(data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Citas</h1>
        <p className="text-stone-400 text-sm mt-1">
          Todas las sesiones de la plataforma.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "Todas" },
          { value: "confirmed", label: "Confirmadas" },
          { value: "completed", label: "Completadas" },
          { value: "cancelled", label: "Canceladas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-orange-400 text-white"
                : "bg-white text-stone-500 border border-orange-100 hover:bg-orange-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-orange-400">Cargando citas...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Counselor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Horario
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-stone-400 text-sm"
                  >
                    No hay citas con ese filtro.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr
                    key={apt._id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-stone-700">
                      {apt.client?.firstName} {apt.client?.lastName}
                      <div className="text-xs text-stone-400">
                        {apt.client?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-700">
                      {apt.counselor?.firstName} {apt.counselor?.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(apt.date).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {apt.time}hs
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${statusConfig[apt.status]?.color}`}
                      >
                        {statusConfig[apt.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {["confirmed", "pending"].includes(apt.status) && (
                        <button
                          onClick={() => setTransferring(apt)}
                          className="text-xs text-orange-400 font-medium hover:text-orange-600 transition-colors"
                        >
                          Transferir
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {transferring && (
            <TransferModal
              appointment={transferring}
              isAdmin={true}
              onClose={() => setTransferring(null)}
              onSuccess={() => {
                setTransferring(null);
                adminService
                  .getAllAppointments()
                  .then((data) => setAppointments(data.appointments));
              }}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
}
