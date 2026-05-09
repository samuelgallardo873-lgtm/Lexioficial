import { Link } from "react-router-dom";
import {
  Scale,
  Video,
  MessageSquare,
  CheckCircle,
  Shield,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Lexi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm hover:text-primary">
              Cómo funciona
            </a>
            <a href="#beneficios" className="text-sm hover:text-primary">
              Beneficios
            </a>
          </nav>
          <Button asChild>
            <Link to="/find-lawyer">Buscar abogado</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1687289133469-b2a07a13b78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXN0aWNlJTIwbGF3JTIwc2NhbGVzfGVufDF8fHx8MTc3MjcxMjI5N3ww&ixlib=rb-4.1.0&q=80&w=1080")',
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conecta con el abogado perfecto para tu caso
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Asesoría legal profesional a tu alcance. Consultas orales o escritas
              con abogados especializados en tu área de necesidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/find-lawyer">Comenzar ahora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#como-funciona">Cómo funciona</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problema/Solución */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Cansado de pagar precios exorbitantes por tu consulta judicial?
            </h2>
            <p className="text-xl md:text-2xl font-semibold opacity-95">
              Nosotros somos tu solución
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">Desde $45</div>
                <p className="text-sm opacity-90">Consultas accesibles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">100%</div>
                <p className="text-sm opacity-90">Transparente</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">24h</div>
                <p className="text-sm opacity-90">Respuesta rápida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de consulta */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Elige tu tipo de consulta
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Consulta Oral</h3>
                <p className="text-muted-foreground mb-4">
                  Videollamada en tiempo real con tu abogado. Ideal para casos
                  complejos que requieren interacción directa.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Interacción en tiempo real
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Preguntas y respuestas inmediatas
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Sesiones de 30-60 minutos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Consulta Escrita</h3>
                <p className="text-muted-foreground mb-4">
                  Describe tu caso por escrito y recibe una respuesta detallada.
                  Perfecta para consultas puntuales.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Respuesta en 24-48 horas
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Documento detallado y permanente
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Más económica
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Describe tu caso</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona la especialidad legal que necesitas y el tipo de
                consulta
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Elige tu abogado</h3>
              <p className="text-sm text-muted-foreground">
                Revisa perfiles, calificaciones y elige el abogado ideal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Agenda tu consulta</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona fecha, hora y realiza el pago seguro
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Recibe asesoría</h3>
              <p className="text-sm text-muted-foreground">
                Obtén la orientación legal que necesitas de forma profesional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Abogados verificados</h3>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros profesionales están certificados y verificados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Respuesta rápida</h3>
                <p className="text-sm text-muted-foreground">
                  Obtén asesoría legal cuando la necesites, sin esperas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Alta calidad</h3>
                <p className="text-sm text-muted-foreground">
                  Profesionales con excelentes calificaciones y experiencia
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para obtener asesoría legal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Conecta con un abogado especializado en minutos
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/find-lawyer">Comenzar ahora</Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
