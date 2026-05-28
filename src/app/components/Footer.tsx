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
            <li><Link to="/" className="hover:text-slate-200 transition-colors">Inicio</Link></li>
            <li><Link to="/find-lawyer" className="hover:text-slate-200 transition-colors">Buscar Abogados</Link></li>
            <li><Link to="/faq" className="hover:text-slate-200 transition-colors">Preguntas Frecuentes</Link></li>
            {isAdmin && (
              <li className="pt-2">
                <Link to="/admin" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold border border-primary/20">
                  <ShieldAlert className="w-4 h-4" /> Panel de Control
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="pt-8 border-t border-slate-900 w-full flex flex-col items-center gap-3 relative">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            © 2026 Lexi. Todos los derechos reservados.
          </p>
          {!isAdmin && (
            <Link to="/admin/login" className="absolute right-0 bottom-0 p-2 text-slate-800 hover:text-slate-600 transition-colors" title="Acceso Administrativo">
              <Lock className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
