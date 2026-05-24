import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import counselorService from "../services/counselorService";

const specialties = [
  "Todas",
  "Duelo y Pérdida",
  "Estrés",
  "Ansiedad",
  "Relaciones y Vínculos",
  "Transiciones Vitales",
  "Autoestima",
  "Burnout laboral",
  "Familia",
];

export default function Counselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (selectedSpecialty !== "Todas") filters.specialty = selectedSpecialty;
      const data = await counselorService.getAll(filters);
      setCounselors(data.counselors);
    } catch (error) {
      console.error("Error cargando counselors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCounselors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecialty]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCounselors();
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">
            Nuestros Counselors
          </h1>
          <p className="text-stone-500 mt-1">
            Encontrá el profesional ideal para vos.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-5 border border-orange-100 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Buscar
            </button>
          </form>

          {/* Especialidades */}
          <div className="flex gap-2 flex-wrap">
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedSpecialty === s
                    ? "bg-orange-400 text-white"
                    : "bg-orange-50 text-stone-500 hover:bg-orange-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de counselors */}
        {loading ? (
          <div className="text-center py-20 text-orange-400">
            Cargando counselors...
          </div>
        ) : counselors.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            No se encontraron counselors con esos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <div
                key={counselor._id}
                className="bg-white rounded-2xl border border-orange-100 overflow-hidden hover:border-orange-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="h-40 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-orange-200 flex items-center justify-center text-3xl font-bold text-orange-400">
                    {counselor.firstName.charAt(0)}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-stone-800 text-lg">
                    {counselor.firstName} {counselor.lastName}
                  </h3>

                  {/* Especialidades */}
                  <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    {counselor.counselorProfile?.specialties
                      ?.slice(0, 2)
                      .map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full border border-orange-100"
                        >
                          {s}
                        </span>
                      ))}
                  </div>

                  <p className="text-sm text-stone-400 line-clamp-2 mb-4">
                    {counselor.counselorProfile?.bio}
                  </p>

                  {/* Rating y precio */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-amber-500 font-medium">
                      ⭐ {counselor.counselorProfile?.rating} ·{" "}
                      {counselor.counselorProfile?.totalSessions} sesiones
                    </span>
                    <span className="text-sm font-bold text-stone-700">
                      ${counselor.counselorProfile?.hourlyRate} USD
                    </span>
                  </div>

                  <Link
                    to={`/counselors/${counselor._id}`}
                    className="block text-center bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
