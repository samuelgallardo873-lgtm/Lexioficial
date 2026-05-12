import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CalendarCheck,
  MessageCircle,
  CreditCard,
  Scale
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Footer } from "../components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Lexi</span>
            </div>
          </div>
          <Button asChild className="rounded-full px-6 shadow-md shadow-primary/20">
            <Link to="/find-lawyer">Buscar abogado</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Cómo Funciona y Dudas Frecuentes
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Conectar con un abogado nunca fue tan fácil. Sigue estos simples pasos para obtener la asesoría que necesitas.
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16">El Proceso Lexi</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Busca</h3>
              <p className="text-muted-foreground text-sm">Explora nuestro directorio de abogados filtrando por especialidad y tipo de consulta.</p>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border -z-10" />
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <CalendarCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Selecciona</h3>
              <p className="text-muted-foreground text-sm">Revisa los perfiles, calificaciones y tarifas de cada profesional antes de elegir.</p>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border -z-10" />
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Reserva</h3>
              <p className="text-muted-foreground text-sm">Realiza el pago de forma segura a través de nuestra plataforma usando Mercado Pago.</p>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border -z-10" />
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">4. Conecta</h3>
              <p className="text-muted-foreground text-sm">Realiza tu consulta (virtual, presencial o escrita) y obtén tu respuesta legal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-semibold text-lg">¿Cómo se garantiza la calidad de los abogados?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Todos los abogados registrados en Lexi pasan por un proceso de verificación exhaustivo, incluyendo la validación de sus credenciales, registro profesional y experiencia en su área de especialidad.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-semibold text-lg">¿Qué métodos de pago aceptan?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago, garantizando una transacción 100% segura. El pago se retiene y solo se libera al abogado una vez finalizada la consulta.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-semibold text-lg">¿Qué pasa si el abogado no se presenta a la consulta?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Si el profesional no asiste a la cita programada, te ofrecemos la opción de reprogramarla sin costo adicional o solicitar un reembolso completo e inmediato de tu dinero.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-semibold text-lg">¿Cómo funciona la consulta escrita?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Al solicitar una consulta escrita, podrás enviar un formulario con los detalles de tu caso y adjuntar documentos. El abogado analizará la información y te entregará un informe detallado con sus recomendaciones legales en el plazo acordado.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-semibold text-lg">¿Mi información es confidencial?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Absolutamente. Todas las comunicaciones y documentos compartidos a través de Lexi están protegidos por estrictos acuerdos de confidencialidad y secreto profesional legal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">¿Listo para resolver tu caso?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Miles de personas ya han encontrado la asesoría legal que necesitan a través de Lexi.
          </p>
          <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20" asChild>
            <Link to="/find-lawyer">Encontrar a mi abogado</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
