import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, CheckCircle, Shield, Scale, Calendar, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Separator } from "../components/ui/separator";

interface PaymentMethod {
  type: "credit" | "debit" | "pagofacil" | "rapipago";
  label: string;
  icon: string;
}

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

  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [dni, setDni] = useState("");

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No hay información de pago</p>
          <Button asChild>
            <Link to="/find-lawyer">Volver a búsqueda</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const consultationPrice = lawyer.price[consultationType];
  const depositAmount = consultationPrice * 0.25;

  const paymentMethods: PaymentMethod[] = [
    { type: "credit", label: "Tarjeta de Crédito", icon: "💳" },
    { type: "debit", label: "Tarjeta de Débito", icon: "💳" },
    { type: "pagofacil", label: "Pago Fácil", icon: "🏪" },
    { type: "rapipago", label: "Rapipago", icon: "🏪" },
  ];

  const handlePayment = () => {
    navigate("/confirmation", {
      state: {
        lawyer,
        consultationType,
        caseDescription,
        clientName,
        clientAge,
        caseType,
        selectedDate,
        selectedTime,
        paymentAmount: depositAmount,
        paymentMethod,
      },
    });
  };

  const canProceed = () => {
    if (paymentMethod === "credit" || paymentMethod === "debit") {
      return cardNumber.length >= 16 && cardName.trim() && expiryDate.length >= 5 && cvv.length >= 3;
    }
    return dni.trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">LegalConnect</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Pago de Anticipo</h1>
          <p className="text-muted-foreground">
            Para confirmar tu consulta, abona el 25% del total
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Método de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.type}
                        className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors"
                      >
                        <RadioGroupItem value={method.type} id={method.type} />
                        <Label htmlFor={method.type} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{method.icon}</span>
                            <span>{method.label}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Detalles del pago */}
            {(paymentMethod === "credit" || paymentMethod === "debit") && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de la tarjeta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setCardNumber(value.slice(0, 16));
                      }}
                      maxLength={16}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nombre del titular *</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setExpiryDate(value.slice(0, 5));
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setCvv(value.slice(0, 4));
                        }}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(paymentMethod === "pagofacil" || paymentMethod === "rapipago") && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dni">DNI del pagador *</Label>
                    <Input
                      id="dni"
                      type="text"
                      placeholder="12345678"
                      value={dni}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setDni(value);
                      }}
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 mb-2 font-semibold">
                      Instrucciones de pago
                    </p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Recibirás un código de pago por email</li>
                      <li>Acércate a cualquier local de {paymentMethod === "pagofacil" ? "Pago Fácil" : "Rapipago"}</li>
                      <li>Presenta el código y abona el monto indicado</li>
                      <li>Recibirás la confirmación una vez procesado el pago</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seguridad */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">Pago 100% seguro</p>
                    <p className="text-xs text-muted-foreground">
                      Tus datos están protegidos con encriptación SSL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Abogado</p>
                  <p className="font-semibold">{lawyer.name}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                  <p className="font-semibold">{clientName}</p>
                  {clientAge && <p className="text-sm text-muted-foreground">{clientAge} años</p>}
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tipo de consulta</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {consultationConfig[consultationType]?.emoji}
                    </span>
                    <p className="font-semibold">{consultationConfig[consultationType]?.label}</p>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Fecha y hora</p>
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{selectedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                    </div>
                  </>
                )}

                {caseType && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tipo de caso</p>
                      <p className="font-semibold capitalize">{caseType === 'unknown' ? 'Por determinar' : caseType}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Precio total consulta:</span>
                    <span>${consultationPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Anticipo (25%):</span>
                    <span className="font-semibold">${depositAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Saldo restante:</span>
                    <span>${consultationPrice - depositAmount}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold">A pagar ahora:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${depositAmount}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={!canProceed()}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar pago
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  El saldo restante se abonará después de la consulta
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
