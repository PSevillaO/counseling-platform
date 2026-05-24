import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CtaSection() {
  const { user } = useAuth();

  return (
    <section
      className="py-20 px-6 text-center text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #E8845A 0%, #C96048 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 bg-white"
        style={{ transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 bg-white"
        style={{ transform: "translate(-30%, 30%)" }}
      />

      <div className="relative max-w-xl mx-auto">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ¿Listo para empezar tu camino?
        </h2>
        <p className="text-orange-100 mb-8 text-base">
          Reservá tu primera sesión hoy y comenzá a sentirte mejor.
        </p>
        <Link
          to={user ? "/counselors" : "/register"}
          className="inline-block bg-white text-orange-400 font-bold px-10 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm"
        >
          Reservar sesión ahora
        </Link>
      </div>
    </section>
  );
}
