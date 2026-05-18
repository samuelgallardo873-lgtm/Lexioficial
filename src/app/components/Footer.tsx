import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-400 max-w-xs">
            Conecta con profesionales legales de confianza en un solo lugar.
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-slate-200 transition-colors">Inicio</Link></li>
            <li><Link to="/find-lawyer" className="hover:text-slate-200 transition-colors">Buscar Abogados</Link></li>
            <li><Link to="/faq" className="hover:text-slate-200 transition-colors">Preguntas Frecuentes</Link></li>
            <li><Link to="/join-as-lawyer" className="hover:text-slate-200 transition-colors">Soy Abogado</Link></li>
            <li><Link to="/admin" className="hover:text-slate-200 transition-colors">Panel Admin</Link></li>
          </ul>
        </div>
        
        <div className="pt-8 border-t border-slate-900 w-full flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            © 2026 Lexi. Todos los derechos reservados.
          </p>
          <Link
            to="/join-as-lawyer"
            className="text-xs text-slate-700 hover:text-slate-500 transition-colors duration-200"
          >
            ¿Eres abogado? Únete a la plataforma
          </Link>
        </div>
      </div>
    </footer>
  );
}
