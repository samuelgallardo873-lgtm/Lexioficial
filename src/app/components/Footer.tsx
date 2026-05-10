import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-400 max-w-xs">
            Conecta con profesionales legales de confianza en un solo lugar.
          </p>
        </div>
        
        <div className="pt-8 border-t border-slate-900 w-full">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            © 2026 Lexi. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
