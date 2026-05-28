import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import noteService from "../services/noteService";
import appointmentService from "../services/appointmentService";

export default function ClientNotes() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, apptsData] = await Promise.all([
          noteService.getNotes(clientId),
          appointmentService.getAll(),
        ]);
        setNotes(notesData.notes);

        // Filtrar citas de este cliente
        const clientApts = apptsData.appointments.filter(
          (a) => a.client?._id === clientId || a.client === clientId,
        );
        setAppointments(clientApts);

        // Obtener nombre del cliente de las citas
        if (clientApts.length > 0) {
          const client = clientApts[0].client;
          setClientName(`${client.firstName} ${client.lastName}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleCreate = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const data = await noteService.createNote(clientId, {
        content: newNote,
        appointmentId: selectedAppointment || null,
      });
      setNotes([data.note, ...notes]);
      setNewNote("");
      setSelectedAppointment("");
    } catch (error) {
      alert("Error al guardar la nota." + error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (noteId) => {
    if (!editContent.trim()) return;
    try {
      const data = await noteService.updateNote(noteId, editContent);
      setNotes(notes.map((n) => (n._id === noteId ? data.note : n)));
      setEditingId(null);
    } catch (error) {
      alert("Error al actualizar la nota." + error);
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm("¿Eliminar esta nota?")) return;
    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter((n) => n._id !== noteId));
    } catch (error) {
      alert("Error al eliminar la nota." + error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-400">Cargando notas...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/appointments")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver a sesiones
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Notas de sesión
            </h1>
            {clientName && (
              <p className="text-stone-400 text-sm mt-1">
                Cliente: {clientName}
              </p>
            )}
          </div>
          <div className="bg-white rounded-xl border border-orange-100 px-4 py-2 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {notes.length}
            </div>
            <div className="text-xs text-stone-400">notas</div>
          </div>
        </div>

        {/* Nueva nota */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-6">
          <h2 className="font-semibold text-stone-700 mb-4">Nueva nota</h2>

          {appointments.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Vincular a una sesión (opcional)
              </label>
              <select
                value={selectedAppointment}
                onChange={(e) => setSelectedAppointment(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Sin sesión vinculada</option>
                {appointments.map((apt) => (
                  <option key={apt._id} value={apt._id}>
                    {new Date(apt.date).toLocaleDateString("es-AR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                    })}{" "}
                    — {apt.time}hs ({apt.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Escribí tus notas sobre esta sesión o cliente..."
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-stone-300">
              {newNote.length}/2000
            </span>
            <button
              onClick={handleCreate}
              disabled={saving || !newNote.trim()}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar nota"}
            </button>
          </div>
        </div>

        {/* Lista de notas */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-orange-100 p-10 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-stone-400 text-sm">
              No hay notas para este cliente todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-2xl border border-orange-100 p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-stone-400">
                      {new Date(note.createdAt).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {note.appointment && (
                      <span className="ml-2 text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full border border-orange-100">
                        📅{" "}
                        {new Date(note.appointment.date).toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "short",
                            timeZone: "UTC",
                          },
                        )}{" "}
                        {note.appointment.time}hs
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(note._id);
                        setEditContent(note.content);
                      }}
                      className="text-xs text-stone-400 hover:text-orange-400 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-xs text-stone-400 hover:text-red-400 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {editingId === note._id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1.5 border border-stone-200 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleEdit(note._id)}
                        className="text-xs bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
