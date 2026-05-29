import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Home, MessageSquare, ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Footer } from "../components/Footer";

const consultationConfig = {
  "oral-presencial": { label: "Oral presencial", emoji: "💬👤" },
  "escrita-presencial": { label: "Escrita presencial", emoji: "📝✍️" },
  "oral-videollamada": { label: "Oral por videollamada", emoji: "💬📹" },
  "escrita-videollamada": { label: "Escrita por videollamada", emoji: "📝💻" },
};

export function ConfirmationPage() {
  const location = useLocation();
  const [bookingData, setBookingData] = useState<any>(location.state || null);
  const [isProcessing, setIsProcessing] = useState(!location.state);

  useEffect(() => {
    // Si venimos de Mercado Pago, location.state estará vacío, así que leemos de sessionStorage
    const storedBooking = sessionStorage.getItem('lexi_last_booking');
    
    if (storedBooking && !bookingData) {
      const parsedData = JSON.parse(storedBooking);
      setBookingData(parsedData);
      setIsProcessing(false);
      // Nota: Ya no llamamos a /api/confirm-booking desde aquí.
      // El Webhook de Mercado Pago se encarga de confirmar la cita y enviar correos 
      // de forma segura en el backend cuando detecta el pago.
    } else {
      setIsProcessing(false);
    }
  }, [bookingData]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-xl font-bold">Procesando tu pago...</h3>
          <p className="text-muted-foreground">Estamos confirmando la reserva con el abogado.</p>
        </Card>
      </div>
    );
  }

  if (!bookingData || !bookingData.lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No se encontró información de la consulta
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const {
    lawyer,
    consultationType,
    caseDescription,
    selectedDate,
    selectedTime,
    paymentAmount,
  } = bookingData;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-3xl">¡Solicitud enviada con éxito!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Tu solicitud de consulta ha sido enviada correctamente
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Detalles de tu consulta</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Abogado</p>
                <div className="flex items-center gap-3">
                  <img
                    src={lawyer.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300"}
                    alt={lawyer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{lawyer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lawyer.specialty.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Tipo de consulta
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {consultationConfig[consultationType]?.emoji}
                  </span>
                  <p className="font-semibold">{consultationConfig[consultationType]?.label}</p>
                </div>
              </div>

              <Separator />

              {selectedDate && selectedTime && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fecha y hora agendada
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{selectedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Descripción del caso
                </p>
                <p className="text-sm bg-background p-3 rounded border">
                  {caseDescription}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Anticipo pagado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paymentAmount || "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Próximos pasos
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Recibirás un correo de confirmación con los detalles de tu
                  consulta
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  El abogado revisará tu caso y se pondrá en contacto contigo en
                  las próximas 24 horas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Se te enviará un enlace de pago seguro antes de la consulta
                </span>
              </li>
              {consultationType === "oral" && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    Recibirás un enlace para la videollamada con anticipación
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/find-lawyer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Buscar otro abogado
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
