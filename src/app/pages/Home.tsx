import { Link } from "react-router-dom";
import {
  Scale,
  Video,
  MessageSquare,
  CheckCircle,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Gavel,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Lexi</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              Cómo funciona
            </Link>
            <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">
              Beneficios
            </a>
            <a href="#especialidades" className="text-sm font-medium hover:text-primary transition-colors">
              Especialidades
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Link to="/find-lawyer">Buscar abogado</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_legal_modern_1778433221705.png" 
            alt="Modern Legal Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 fill-primary" />
              La plataforma legal #1 de la región
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Tu asesoría legal, <br />
              <span className="text-primary italic">reinventada.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Conecta con los mejores abogados del país en minutos. 
              Consultas orales o escritas, sin complicaciones y con precios transparentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 group" asChild>
                <Link to="/find-lawyer">
                  Comenzar ahora
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg bg-background/50 backdrop-blur-sm" asChild>
                <Link to="/faq">Ver cómo funciona</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/50 pt-10">
              {[
                { label: "Abogados Activos", val: "+500" },
                { label: "Casos Resueltos", val: "12k" },
                { label: "Satisfacción", val: "99.2%" },
                { label: "Atención", val: "24/7" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.val}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Tipos de consulta */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Elige tu forma de consulta</h2>
            <p className="text-muted-foreground text-lg">Diseñado para adaptarse a tus necesidades y presupuesto.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Consulta Oral */}
            <Card className="md:col-span-2 group overflow-hidden border-none shadow-2xl bg-primary text-primary-foreground relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-colors" />
              <CardContent className="p-10 relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <Video className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Consulta Oral</h3>
                  <p className="text-primary-foreground/80 mb-6 text-lg">
                    Habla cara a cara con un experto. Ideal para casos complejos que requieren 
                    una explicación detallada y estrategia en tiempo real.
                  </p>
                  <Button variant="secondary" className="rounded-full px-8" asChild>
                    <Link to="/find-lawyer">Reservar Videollamada</Link>
                  </Button>
                </div>
                <div className="flex-shrink-0 w-full md:w-64 space-y-3">
                  {["Interacción directa", "Preguntas inmediatas", "Sesiones de 30-60 min"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Consulta Escrita */}
            <Card className="group overflow-hidden border-none shadow-2xl bg-background border border-border">
              <CardContent className="p-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Consulta Escrita</h3>
                  <p className="text-muted-foreground mb-8">
                    Recibe un informe legal detallado en tu correo. Perfecto para dudas 
                    puntuales y revisión de documentos.
                  </p>
                </div>
                <Button className="w-full rounded-full" variant="outline" asChild>
                  <Link to="/find-lawyer">Solicitar Informe</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Especialidades: Bento Minimalist */}
      <section id="especialidades" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Expertos en cada área</h2>
              <p className="text-muted-foreground text-lg">Contamos con una red de profesionales especializados en múltiples ramas del derecho.</p>
            </div>
            <Button variant="link" className="text-primary font-bold group">
              Ver todas las especialidades <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Civil", icon: Scale, color: "bg-blue-500/10 text-blue-600" },
              { title: "Penal", icon: Gavel, color: "bg-red-500/10 text-red-600" },
              { title: "Familiar", icon: Users, color: "bg-purple-500/10 text-purple-600" },
              { title: "Mercantil", icon: Building2, color: "bg-amber-500/10 text-amber-600" },
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-border hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer bg-background">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-widest">Ver Abogados</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios: Estilo Moderno */}
      <section id="beneficios" className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 tracking-tight">La diferencia Lexi</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Seguridad Total</h3>
              <p className="text-slate-400 leading-relaxed">
                Todos nuestros abogados pasan por un riguroso proceso de validación y certificación profesional.
              </p>
            </div>
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Inmediatez</h3>
              <p className="text-slate-400 leading-relaxed">
                Olvida las esperas de semanas. Encuentra y agenda tu consulta legal en cuestión de minutos.
              </p>
            </div>
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Calidad Premium</h3>
              <p className="text-slate-400 leading-relaxed">
                Solo los profesionales con mejores calificaciones permanecen en nuestra red exclusiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final: Impacto Visual */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground text-center relative overflow-hidden shadow-2xl shadow-primary/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">¿Tienes un caso legal? <br /> Estamos para ayudarte.</h2>
              <p className="text-xl mb-12 text-primary-foreground/80 font-medium">
                Únete a los miles de usuarios que ya resolvieron sus dudas con Lexi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="rounded-full h-16 px-10 text-xl font-bold" asChild>
                  <Link to="/find-lawyer">Buscar mi abogado ahora</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
