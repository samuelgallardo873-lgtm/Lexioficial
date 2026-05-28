import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldAlert } from "lucide-react";

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("adminToken"));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800 relative">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-400 max-w-xs">
            Conecta con profesionales legales de confianza en un solo lugar.
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-200 transition-colors">Inicio</Link></li>
            <li><Link to="/find-lawyer" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-200 transition-colors">Buscar Abogados</Link></li>
            <li><Link to="/unete" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 text-amber-500 font-medium transition-colors">¿Eres Abogado?</Link></li>
            <li><Link to="/faq" onClick={() => window.scrollTo(0, 0)} className="hover:text-slate-200 transition-colors">Preguntas Frecuentes</Link></li>
            {isAdmin && (
              <li className="pt-4">
                <Link to="/admin" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all font-bold tracking-wide">
                  <ShieldAlert className="w-5 h-5" /> Ir al Panel de Control
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="pt-8 border-t border-slate-900 w-full flex flex-col items-center gap-3 relative">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            © 2026 Lexi. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
