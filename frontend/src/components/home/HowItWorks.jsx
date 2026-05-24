const steps = [
  {
    number: "1",
    title: "Buscá tu Counselor",
    desc: "Explorá nuestro directorio de profesionales certificados, filtrados por especialidad y disponibilidad.",
  },
  {
    number: "2",
    title: "Elegí Fecha y Hora",
    desc: "Seleccioná el horario que mejor se adapte a tu vida. Nuestros counselors ofrecen total flexibilidad.",
  },
  {
    number: "3",
    title: "Sesión Virtual",
    desc: "Conectate por video desde la comodidad de tu hogar. Privacidad y confidencialidad garantizadas.",
  },
  {
    number: "4",
    title: "Seguimiento",
    desc: "Compartí tu experiencia y accedé a recursos recomendados por tu counselor para continuar creciendo.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          El proceso
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Así de simple es empezar
        </h2>
        <p className="text-center text-stone-400 text-sm mb-12 max-w-md mx-auto">
          Cuatro pasos para conectar con el profesional ideal para vos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                style={{
                  background: "linear-gradient(135deg, #E8845A, #F2A7B0)",
                  fontFamily: "Georgia, serif",
                }}
              >
                {step.number}
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">
                {step.title}
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
