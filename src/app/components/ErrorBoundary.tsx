import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError() as any;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold mb-3 tracking-tight">Oops! Algo salió mal.</h1>
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        {error?.message || "Ha ocurrido un error inesperado en la aplicación. Hemos registrado el problema y estamos trabajando para solucionarlo."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button onClick={() => window.location.reload()} size="lg" className="rounded-xl h-12 shadow-lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Recargar Página
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl h-12">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Ir al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
