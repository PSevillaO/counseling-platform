import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import counselorService from "../../services/counselorService";

export default function FeaturedCounselors() {
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    counselorService
      .getAll()
      .then((data) => {
        setCounselors(data.counselors.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const gradients = [
    "from-orange-100 to-pink-100",
    "from-yellow-100 to-orange-100",
    "from-green-100 to-yellow-100",
    "from-pink-100 to-green-100",
  ];

  return (
    <section
      id="counselors"
      className="py-20 px-6"
      style={{ backgroundColor: "#FEF3EE" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          Nuestro equipo
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Counselors Destacados
        </h2>
        <p className="text-center text-stone-400 text-sm mb-12 max-w-md mx-auto">
          Profesionales certificados listos para acompañarte.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {counselors.map((c, i) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-orange-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
            >
              <div
                className={`h-36 bg-gradient-to-br ${gradients[i]} flex items-center justify-center`}
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-2xl font-bold text-orange-400">
                  {c.firstName.charAt(0)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-stone-800">
                  {c.firstName} {c.lastName}
                </h3>
                <p className="text-orange-400 text-xs font-medium mb-2">
                  {c.counselorProfile?.specialties?.[0]}
                </p>
                <p className="text-xs text-amber-500 mb-3">
                  ⭐ {c.counselorProfile?.rating} ·{" "}
                  {c.counselorProfile?.totalSessions} sesiones
                </p>
                <Link
                  to={`/counselors/${c._id}`}
                  className="block text-center bg-orange-50 hover:bg-orange-400 text-orange-400 hover:text-white font-semibold py-2 rounded-lg transition-colors text-xs border border-orange-100 hover:border-orange-400"
                >
                  Reservar Sesión
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/counselors"
            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm shadow-sm"
          >
            Ver todos los counselors
          </Link>
        </div>
      </div>
    </section>
  );
}
