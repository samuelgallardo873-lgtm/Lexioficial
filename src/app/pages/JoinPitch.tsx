import { useEffect } from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../lib/scroll";
import { Scale, TrendingUp, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Footer } from "../components/Footer";

export function JoinPitch() {
  useEffect(() => {
    setTimeout(scrollToTop, 10);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Lexi</span>
          </Link>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/join" onClick={scrollToTop}>Registrarse como Abogado</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              ¿Quieres trabajar con nosotros y <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-primary">sumarte al equipo?</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Únete a la plataforma legal líder. Conecta con clientes de todo el país, gestiona tus consultas online y multiplica tus ingresos sin preocuparte por el marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25">
                <Link to="/join" onClick={scrollToTop}>
                  Llenar formulario de ingreso
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Por qué los mejores abogados eligen Lexi</h2>
              <p className="text-muted-foreground">Nos encargamos de conseguirte clientes para que tú solo te enfoques en brindar la mejor asesoría legal.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-8 text-center px-6 pb-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Más Clientes</h3>
                  <p className="text-muted-foreground">Recibe solicitudes de consultas directamente en tu correo. Nosotros hacemos el marketing por ti.</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-8 text-center px-6 pb-8">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Pagos Seguros</h3>
                  <p className="text-muted-foreground">Garantizamos el pago de tus anticipos a través de Mercado Pago antes de cada consulta agendada.</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-lg">
                <CardContent className="pt-8 text-center px-6 pb-8">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Flexibilidad Total</h3>
                  <p className="text-muted-foreground">Tú decides tus precios y horarios. Atiende por videollamada o de forma escrita desde cualquier lugar.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
