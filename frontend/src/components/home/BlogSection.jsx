const posts = [
  {
    emoji: "🌱",
    gradient: "from-orange-100 to-pink-100",
    tag: "Bienestar",
    title: "5 señales de que estás listo para pedir ayuda emocional",
    desc: "Reconocer el momento justo puede cambiar todo. Te contamos cuáles son las señales más comunes.",
    date: "12 Mayo 2026",
    time: "5 min",
  },
  {
    emoji: "🧘",
    gradient: "from-yellow-100 to-orange-100",
    tag: "Estrés",
    title: "Cómo manejar la ansiedad laboral sin que consuma tu vida",
    desc: "El estrés en el trabajo es real. Te compartimos herramientas prácticas que usamos en sesiones.",
    date: "5 Mayo 2026",
    time: "7 min",
  },
  {
    emoji: "💚",
    gradient: "from-green-100 to-yellow-100",
    tag: "Relaciones",
    title: "Vínculos sanos: cómo comunicarte mejor con quienes amás",
    desc: "La comunicación es la base de todo vínculo. Aprendé a expresarte con claridad y empatía.",
    date: "28 Abril 2026",
    time: "6 min",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold text-orange-400 tracking-widest uppercase mb-3">
          Comunidad & recursos
        </p>
        <h2
          className="text-4xl font-bold text-stone-800 text-center mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Aprendé, crecé, conectá
        </h2>
        <p className="text-center text-stone-400 text-sm mb-12 max-w-md mx-auto">
          Artículos escritos por nuestros counselors para acompañarte en tu día
          a día.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {posts.map((post) => (
            <div
              key={post.title}
              className="bg-white rounded-2xl border border-orange-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
            >
              <div
                className={`h-40 bg-gradient-to-br ${post.gradient} flex items-center justify-center text-5xl`}
              >
                {post.emoji}
              </div>
              <div className="p-5">
                <span className="text-xs bg-orange-50 text-orange-400 px-3 py-1 rounded-full border border-orange-100 font-medium">
                  {post.tag}
                </span>
                <h3
                  className="font-bold text-stone-800 mt-3 mb-2 leading-snug"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {post.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                  {post.desc}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-300">
                    📅 {post.date} · ⏱ {post.time}
                  </span>
                  <a
                    href="#"
                    className="text-orange-400 text-xs font-semibold hover:underline"
                  >
                    Leer →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border-2 border-orange-300 text-orange-400 hover:bg-orange-400 hover:text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm">
            Ver todos los artículos
          </button>
        </div>
      </div>
    </section>
  );
}
