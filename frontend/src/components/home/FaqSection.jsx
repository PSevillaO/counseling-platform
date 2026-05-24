import { useState } from "react";

const faqs = [
  {
    q: "¿Qué es exactamente el Counseling?",
    a: "El Counseling es una forma de acompañamiento emocional profesional que te ayuda a navegar los desafíos de la vida. No es psicoterapia clínica, sino apoyo enfocado en tu bienestar actual y crecimiento personal.",
  },
  {
    q: "¿Mis sesiones son confidenciales?",
    a: "Absolutamente. La confidencialidad es fundamental. Todo lo que compartás en nuestras sesiones está protegido por estándares internacionales de privacidad y encriptación.",
  },
  {
    q: "¿Necesito hacer una suscripción?",
    a: "No. Podés reservar sesiones individuales cuando lo necesitás. También ofrecemos paquetes con descuento si preferís un acompañamiento más regular.",
  },
  {
    q: "¿Cómo funciona técnicamente la sesión?",
    a: "Usamos Zoom para las sesiones de video. Vas a recibir un link seguro 15 minutos antes de tu cita. Solo necesitás una conexión a internet confiable.",
  },
  {
    q: "¿Puedo cambiar o cancelar mi cita?",
    a: "Sí. Podés cambiar tu cita hasta 24 horas antes. Las cancelaciones con más de 24 horas de anticipación son completamente gratis.",
  },
  {
    q: "¿Cuánto cuesta una sesión?",
    a: "Las sesiones varían según el counselor, generalmente entre $30-60 USD. Ofrecemos una primera sesión de consulta a precio reducido.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      className="py-20 px-6"
      style={{ backgroundColor: "#FFF8F5" }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          Preguntas frecuentes
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ¿Tenés dudas?
        </h2>
        <p className="text-center text-stone-400 text-sm mb-12">
          Todo lo que necesitás saber antes de dar el primer paso.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-orange-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:text-orange-400 transition-colors text-sm font-semibold text-stone-700"
              >
                {faq.q}
                <span
                  className={`text-orange-300 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-stone-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
