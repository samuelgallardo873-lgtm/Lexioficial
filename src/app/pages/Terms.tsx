import { useEffect } from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../lib/scroll";
import { ArrowLeft, Scale, Shield, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

export function Terms() {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 pb-12 flex flex-col">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">Lexi</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Términos y Condiciones</h1>
          <p className="text-muted-foreground text-lg">
            Por favor, lee atentamente nuestras políticas antes de utilizar la plataforma.
          </p>
        </div>

        <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border/50 space-y-8 prose prose-slate dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              1. Naturaleza del Servicio (Aviso Legal)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Lexi es exclusivamente una plataforma tecnológica de intermediación.</strong> No somos un estudio jurídico, no proveemos asesoramiento legal directo, ni garantizamos resultados en ningún litigio o proceso legal. 
              Nuestra función se limita estrictamente a conectar usuarios (clientes) con abogados independientes registrados en la plataforma. 
              La relación cliente-abogado, así como la calidad, exactitud y confidencialidad del asesoramiento brindado, son responsabilidad exclusiva del profesional legal contratado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Pagos, Anticipos y Honorarios</h2>
            <p className="text-muted-foreground leading-relaxed">
              El pago que el usuario realiza a través de la plataforma (denominado "Anticipo" o "Reserva") equivale a un porcentaje (típicamente el 25%) del valor total de la consulta. Este pago es cobrado por Lexi en concepto de uso de la plataforma tecnológica, gestión del emparejamiento, y reserva del espacio en la agenda del profesional.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              El saldo restante de la consulta (típicamente el 75%) deberá ser abonado de manera directa al abogado el día de la cita, utilizando los métodos de pago que dicho profesional acepte. Lexi no interviene en el cobro de este saldo restante ni toma comisiones sobre el mismo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Políticas de Cancelación y Reembolsos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Debido a que el anticipo abonado mediante Mercado Pago cubre los costos inmediatos de gestión tecnológica y reserva de agenda:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Cancelaciones por parte del usuario:</strong> Si el usuario decide cancelar el turno o no se presenta al mismo ("no-show"), el anticipo pagado a Lexi es de carácter estrictamente <strong>no reembolsable</strong>.</li>
              <li><strong>Cancelaciones por parte del abogado:</strong> Si el abogado independiente cancela el turno o no asiste a la consulta programada, el usuario tendrá derecho al reembolso íntegro del anticipo abonado, el cual será gestionado a través de Mercado Pago.</li>
              <li><strong>Reclamos posteriores a la consulta:</strong> Una vez finalizada la consulta (presencial o virtual), los honorarios legales cubren el tiempo brindado por el profesional y no están sujetos a reembolsos en base a la satisfacción del cliente respecto de las opiniones legales emitidas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Privacidad y Seguridad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los datos provistos en el resumen del caso son transmitidos únicamente al abogado seleccionado con el fin de que pueda prepararse para la consulta. Lexi no almacena información de tarjetas de crédito o credenciales bancarias; todo el procesamiento financiero es delegado de manera encriptada a la pasarela de pagos oficial (Mercado Pago).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
