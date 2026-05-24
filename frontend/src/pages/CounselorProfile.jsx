import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import counselorService from "../services/counselorService";

export default function CounselorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const data = await counselorService.getById(id);
        setCounselor(data.counselor);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        navigate("/counselors");
      } finally {
        setLoading(false);
      }
    };
    fetchCounselor();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-400 text-lg">Cargando perfil...</div>
      </div>
    );

  if (!counselor) return null;

  const profile = counselor.counselorProfile;

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/counselors")}
          className="text-sm text-stone-400 hover:text-orange-400 transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver a counselors
        </button>

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden mb-6">
          {/* Header con gradiente */}
          <div className="h-40 bg-gradient-to-br from-orange-100 to-pink-100" />

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end gap-6 -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-orange-200 flex items-center justify-center text-4xl font-bold text-orange-400 shadow-sm">
                {counselor.firstName.charAt(0)}
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-stone-800">
                  {counselor.firstName} {counselor.lastName}
                </h1>
                <p className="text-orange-400 font-medium text-sm">
                  {profile?.specialties?.[0]}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                <p className="text-2xl font-bold text-orange-400">
                  ⭐ {profile?.rating}
                </p>
                <p className="text-xs text-stone-400 mt-1">Rating</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                <p className="text-2xl font-bold text-orange-400">
                  {profile?.totalSessions}
                </p>
                <p className="text-xs text-stone-400 mt-1">Sesiones</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                <p className="text-2xl font-bold text-orange-400">
                  ${profile?.hourlyRate}
                </p>
                <p className="text-xs text-stone-400 mt-1">USD por sesión</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h2 className="font-semibold text-stone-700 mb-2">Sobre mí</h2>
              <p className="text-stone-500 leading-relaxed text-sm">
                {profile?.bio}
              </p>
            </div>

            {/* Especialidades */}
            <div className="mb-8">
              <h2 className="font-semibold text-stone-700 mb-3">
                Especialidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile?.specialties?.map((s) => (
                  <span
                    key={s}
                    className="bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-medium border border-orange-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/book/${counselor._id}`)}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow-sm"
            >
              Reservar sesión con {counselor.firstName}
            </button>
          </div>
        </div>

        {/* Card info adicional */}
        <div className="bg-white rounded-2xl border border-orange-100 p-6">
          <h2 className="font-semibold text-stone-700 mb-4">
            ¿Cómo funciona una sesión?
          </h2>
          <div className="space-y-3">
            {[
              { icon: "🕐", text: "Duración de 50 minutos por sesión" },
              { icon: "🎥", text: "Sesión virtual por videollamada (Zoom)" },
              { icon: "🔒", text: "Completamente privado y confidencial" },
              {
                icon: "📅",
                text: "Cancelación gratuita con 24hs de anticipación",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-sm text-stone-500"
              >
                <span className="text-lg">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
