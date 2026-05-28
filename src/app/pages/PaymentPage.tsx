import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  Scale, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard 
} from "lucide-react";
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

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    lawyer,
    consultationType,
    caseDescription,
    clientName,
    clientAge,
    caseType,
    selectedDate,
    selectedTime,
  } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="p-8 text-center max-w-md mx-auto shadow-2xl border-none rounded-[2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sin información de pago</h3>
            <p className="text-muted-foreground mb-6">No se encontraron detalles de la reserva activa para procesar el cobro.</p>
            <Button asChild className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link to="/find-lawyer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a búsqueda
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consultationPrice = lawyer.price ? (lawyer.price[consultationType] || 0) : 0;
  const depositAmount = consultationPrice * 0.25;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      sessionStorage.setItem('lexi_last_booking', JSON.stringify({
        lawyer,
        consultationType,
        caseDescription,
        clientName,
        clientAge,
        caseType,
        selectedDate,
        selectedTime,
        paymentAmount: depositAmount,
      }));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/create_preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Anticipo de Consulta - Abogado ${lawyer.name}`,
          price: depositAmount,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Error al crear preferencia');
      const data = await response.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al conectar con Mercado Pago");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative payment-page-bg bg-cover bg-center bg-fixed text-foreground">
      {/* Soft overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/95 dark:from-background/80 dark:via-background/90 dark:to-background/98" />
      
      {/* Premium Glassmorphic Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/70 dark:bg-background/60 backdrop-blur-xl z-20 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-muted/80 dark:hover:bg-slate-800/80 transition-colors w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient">Lexi</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/60 dark:bg-slate-800/60 px-4 py-2 rounded-full border border-border/30">
            <span>Datos</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Pago Seguro</span>
            <ChevronRight className="w-3 h-3" />
            <span>Confirmación</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-10 max-w-6xl">
        {/* Modern Welcome Banner */}
        <section className="mb-10 rounded-[2.5rem] border border-white/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 shadow-2xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-black/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm border border-emerald-200/30">
              <ShieldCheck className="w-4 h-4" /> Pasarela Encriptada SSL
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-gradient mb-4">
              Completa tu consulta con un pago seguro
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Abonas solo el 25% de anticipo para garantizar la reserva del abogado. El 75% restante se salda directamente después de la sesión legal, sin cargos sorpresa.
            </p>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* Main Info Area (Left Column) */}
          <div className="space-y-8">
            {/* The Luxury Booking ticket */}
            <Card className="border border-border/40 shadow-xl rounded-[2rem] overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl relative">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />
              <CardHeader className="pt-8 px-8 pb-4">
                <CardTitle className="text-lg font-bold tracking-tight text-muted-foreground uppercase">Resumen del Turno</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                
                {/* Lawyer Portrait Card */}
                <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-border/30">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white dark:border-slate-800">
                    <img 
                      src={lawyer.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300"} 
                      alt={lawyer.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl font-bold">{lawyer.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        Verificado
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Especialista en Derecho Legal</p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {lawyer.specialty && lawyer.specialty.slice(0, 3).map((spec: string) => (
                        <span key={spec} className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground capitalize border border-border/20">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/30 bg-background/50 space-y-1">
                    <span className="text-xs text-muted-foreground block">CLIENTE</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <User className="w-4 h-4 text-primary/70" />
                      <span>{clientName}</span>
                      {clientAge && <span className="text-xs text-muted-foreground">({clientAge} años)</span>}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border/30 bg-background/50 space-y-1">
                    <span className="text-xs text-muted-foreground block">TIPO DE CONSULTA</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-lg">
                        {consultationConfig[consultationType]?.emoji || "💬"}
                      </span>
                      <span>{consultationConfig[consultationType]?.label || "Consulta Legal"}</span>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="p-4 rounded-xl border border-border/30 bg-background/50 space-y-1 sm:col-span-2">
                      <span className="text-xs text-muted-foreground block">AGENDA PROGRAMADA</span>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-primary">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{selectedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          <span>{selectedTime} hs</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Case dossier description */}
                {caseDescription && (
                  <div className="p-5 rounded-2xl border border-dashed border-border/80 bg-amber-50/20 dark:bg-amber-950/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <FileText className="w-4 h-4" />
                      <span>SINOPSIS DEL CASO O CONSULTA</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "{caseDescription}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Official Mercado Pago Integration Card */}
            <Card className="border border-border/40 shadow-xl rounded-[2rem] overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
              <CardHeader className="pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <span className="text-2xl">💳</span> Medio de Pago Oficial
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Serás redirigido con total seguridad al checkout oficial de **Mercado Pago** para completar tu anticipo. Podrás pagar usando dinero en cuenta, tarjetas de débito/crédito, o efectivo en Pago Fácil y Rapipago.
                </p>

                {/* Interactive Premium Selection Panel */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-950/70 p-5 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border shadow-inner flex items-center justify-center w-16 h-16 flex-shrink-0">
                    <img 
                      src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icon-1024.png" 
                      alt="Mercado Pago" 
                      className="h-10 w-10 object-contain" 
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <p className="font-bold text-base">Checkout Pro de Mercado Pago</p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      El saldo restante (${consultationPrice - depositAmount}) se abonará tras la cita de forma flexible.
                    </p>
                  </div>
                </div>

                {/* Security trust badge */}
                <div className="flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-xs font-semibold leading-relaxed">
                    Protección SSL avanzada: Lexi nunca almacena ni tiene acceso a los datos de tu tarjeta de crédito o claves bancarias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating Receipt Column (Right Column) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <Card className="border border-border/40 shadow-2xl rounded-[2.25rem] overflow-hidden bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-600 to-primary" />
              <CardHeader className="pt-8 px-8 pb-4">
                <CardTitle className="text-lg font-bold tracking-wider text-muted-foreground uppercase text-center">Facturación</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                
                {/* Cost Breakdown */}
                <div className="space-y-3.5 text-sm pt-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Precio total de consulta:</span>
                    <span className="font-medium text-foreground">${consultationPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Anticipo obligatorio (25%):</span>
                    <span className="font-semibold text-foreground">${depositAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Saldo pendiente posterior:</span>
                    <span className="font-medium text-foreground">${consultationPrice - depositAmount}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-border/60 my-4" />

                {/* Highlighted To Pay Box */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/20 p-5 border border-indigo-100/50 dark:border-indigo-950/40 text-center space-y-1 shadow-sm">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest block">Total a Abonar Hoy</span>
                  <p className="text-4xl font-extrabold text-indigo-950 dark:text-indigo-100 tracking-tight">
                    ${depositAmount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ARS (Pesos Argentinos)
                  </p>
                </div>

                {/* Master Action Button */}
                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:via-indigo-600 hover:to-indigo-700 text-white font-bold text-base py-6.5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-indigo-500/25 group border-none"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Conectando con Mercado Pago...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 group-hover:translate-y-[-1px] transition-transform" />
                        Pagar Anticipo Seguro con MP
                      </span>
                    )}
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed max-w-[280px] mx-auto">
                    Al confirmar, serás redirigido a la pasarela externa de Mercado Pago. Puedes cancelar la operación en cualquier momento.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick trust highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-border/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
                <span className="text-xl">🔐</span>
                <p className="text-xs font-bold text-foreground">Conexión Segura</p>
                <p className="text-[10px] text-muted-foreground">SSL 256 Bits</p>
              </div>
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-border/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
                <span className="text-xl">💳</span>
                <p className="text-xs font-bold text-foreground">Múltiples Medios</p>
                <p className="text-[10px] text-muted-foreground">Débito, Crédito o Efectivo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
