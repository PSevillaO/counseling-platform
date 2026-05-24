const testimonials = [
  {
    initials: "AB",
    name: "Ana Bellini",
    location: "Buenos Aires, AR",
    text: "La sesión con María fue transformadora. Su calidez y profesionalismo me ayudaron a procesar mi pérdida de una manera que no esperaba. Totalmente recomendado.",
  },
  {
    initials: "CG",
    name: "Carlos García",
    location: "Madrid, ES",
    text: "Finalmente encontré las herramientas que necesitaba para manejar el estrés. Lucas es increíble. Las sesiones son prácticas y realmente funcionales.",
  },
  {
    initials: "MZ",
    name: "Mariana Zapata",
    location: "Córdoba, AR",
    text: "La plataforma es muy fácil de usar y Sofía entendió mis preocupaciones desde el primer momento. Me siento escuchada y apoyada.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          Experiencias reales
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Lo que dicen quienes ya empezaron
        </h2>
        <p className="text-center text-stone-400 text-sm mb-12 max-w-md mx-auto">
          Historias de personas que dieron el primer paso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative"
            >
              <div className="text-6xl text-orange-200 font-serif absolute top-2 left-4 leading-none">
                "
              </div>
              <div className="text-amber-400 text-sm mb-3 mt-4">⭐⭐⭐⭐⭐</div>
              <p className="text-stone-500 text-sm leading-relaxed mb-5 italic">
                {t.text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #E8845A, #F2A7B0)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-stone-700 text-sm">
                    {t.name}
                  </p>
                  <p className="text-stone-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
