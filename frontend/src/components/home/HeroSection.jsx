import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section
      className="relative overflow-hidden py-24 px-6 text-center"
      style={{
        background:
          "linear-gradient(145deg, #FFF8F5 0%, #FAD9DE 50%, #FEF0D0 100%)",
      }}
    >
      {/* Círculos decorativos */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #F2A7B0, transparent)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #F7C97E, transparent)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-block bg-white text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-200 mb-6 tracking-wide">
          ✨ Acompañamiento emocional certificado
        </div>

        <h1
          className="text-5xl font-bold text-stone-800 leading-tight mb-5"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Un espacio seguro para{" "}
          <em className="text-orange-400 not-italic">encontrarte</em> a vos
          mismo
        </h1>

        <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Conectá con counselors profesionales para sesiones de apoyo emocional.
          Privado, accesible y completamente a tu ritmo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={user ? "/counselors" : "/register"}
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 text-sm"
          >
            Reservar mi primera sesión
          </Link>
          <Link
            to="/counselors"
            className="bg-white text-orange-400 font-semibold px-8 py-3.5 rounded-full border-2 border-orange-200 hover:border-orange-400 transition-colors text-sm"
          >
            Conocer los counselors
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-14">
          {[
            { number: "+200", label: "Sesiones realizadas" },
            { number: "18", label: "Counselors activos" },
            { number: "4.9★", label: "Satisfacción promedio" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-bold text-orange-400"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {stat.number}
              </div>
              <div className="text-xs text-stone-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
