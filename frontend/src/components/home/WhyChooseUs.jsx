const features = [
  {
    icon: "🔒",
    title: "Privacidad Garantizada",
    desc: "Tus conversaciones son completamente confidenciales y encriptadas.",
  },
  {
    icon: "🎓",
    title: "Counselors Certificados",
    desc: "Todos nuestros profesionales son verificados y capacitados.",
  },
  {
    icon: "🕐",
    title: "Disponibilidad Flexible",
    desc: "Horarios que se adaptan a tu ritmo de vida.",
  },
  {
    icon: "💬",
    title: "Trato Cálido",
    desc: "Acompañamiento genuino y humanizado. Te importás como persona.",
  },
  {
    icon: "📱",
    title: "Fácil de Usar",
    desc: "Interfaz intuitiva en cualquier dispositivo.",
  },
  {
    icon: "💰",
    title: "Precios Accesibles",
    desc: "Acompañamiento profesional sin romper el bolsillo.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="py-20 px-6"
      style={{
        background: "linear-gradient(145deg, #FAD9DE 0%, #FEF0D0 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          Por qué elegirnos
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-12"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Diseñado para tu bienestar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-orange-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-2xl"
                style={{
                  background: "linear-gradient(135deg, #F5C4AE, #FAD9DE)",
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
