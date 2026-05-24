import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#2C2420" }}
      className="text-stone-400 pt-14 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="text-2xl font-bold text-orange-300 mb-4 block">
              🌸 Contigo
            </span>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              Acompañamiento emocional profesional para tu bienestar. Un espacio
              cálido, seguro y accesible.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/#how"
                  className="hover:text-orange-300 transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/counselors"
                  className="hover:text-orange-300 transition-colors"
                >
                  Nuestros Counselors
                </Link>
              </li>
              <li>
                <Link
                  to="/#blog"
                  className="hover:text-orange-300 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq"
                  className="hover:text-orange-300 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Compañía</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Términos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Seguinos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-600">
          © 2026 Contigo Platform. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
