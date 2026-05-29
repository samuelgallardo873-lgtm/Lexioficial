import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Award,
  CheckCircle,
  Scale,
  Calendar,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { ConsultationType, Lawyer } from "../data/lawyers";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const consultationConfig = {
  "oral-presencial": {
    label: "Oral presencial",
    emoji: "💬👤",
    description: "Reunión presencial en oficina para discutir tu caso",
  },
  "escrita-presencial": {
    label: "Escrita presencial",
    emoji: "📝✍️",
    description: "Entrega y recepción de documentación en oficina",
  },
  "oral-videollamada": {
    label: "Oral por videollamada",
    emoji: "💬📹",
    description: "Videollamada en tiempo real para discutir tu caso",
  },
  "escrita-videollamada": {
    label: "Escrita por videollamada",
    emoji: "📝💻",
    description: "Consulta escrita con seguimiento virtual",
  },
};

// Generar horarios disponibles de ejemplo
const generateAvailableSlots = () => {
  const slots = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

    slots.push({
      date: dateStr,
      fullDate: date,
      times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    });
  }

  return slots;
};

export function LawyerProfile() {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType | "">(
    ""
  );
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchLawyer = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/lawyers/${id}`);
        if (!response.ok) {
          throw new Error("Abogado no encontrado");
        }

        const data = await response.json();
        setLawyer(data);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`${apiUrl}/api/lawyers/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewName,
          rating: Number(reviewRating),
          comment: reviewComment,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar reseña");

      const data = await response.json();
      
      // Update local state
      if (lawyer) {
        setLawyer({
          ...lawyer,
          rating: data.rating,
          reviewsCount: data.reviewsCount,
          reviews: [data.review, ...lawyer.reviews],
        });
      }

      // Reset form
      setReviewName("");
      setReviewComment("");
      setReviewRating("5");
    } catch (error) {
      console.error(error);
      alert("No se pudo enviar la reseña");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!consultationType && lawyer?.consultationType.length) {
      setConsultationType(lawyer.consultationType[0]);
    }
  }, [lawyer, consultationType]);

  // Datos del formulario
  const { user } = useAuth();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAge, setClientAge] = useState("");
  const [caseType, setCaseType] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (user) {
      if (!clientName) setClientName(user.name);
      if (!clientEmail) setClientEmail(user.email);
    }
  }, [user]);

  const availableSlots = generateAvailableSlots();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Cargando abogado...</p>
      </div>
    );
  }

  if (fetchError || !lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {fetchError ?? "Abogado no encontrado"}
          </p>
          <Button asChild>
            <Link to="/find-lawyer">Volver a búsqueda</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleOpenBooking = () => {
    setShowBookingDialog(true);
  };

  const handleSubmitBooking = () => {
    // Validar que todos los campos estén completos
    if (!clientName || !clientAge || !caseType || !caseDescription || !selectedDate || !selectedTime) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Cerrar modal
    setShowBookingDialog(false);

    // Redirigir al panel de pago
    navigate("/payment", {
      state: {
        lawyer,
        consultationType,
        caseDescription,
        clientName,
        clientEmail,
        clientPhone,
        clientAge,
        caseType,
        selectedDate,
        selectedTime,
      },
    });
  };

  const canProceed = () => {
    return (
      clientName.trim() !== "" && 
      clientAge !== "" && 
      Number(clientAge) >= 18 && 
      Number(clientAge) <= 120 && 
      caseType && 
      caseDescription.trim() !== "" && 
      selectedDate && 
      selectedTime
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <Navbar />


      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Perfil */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-1 overflow-hidden rounded-l-lg">
                    <img
                      src={lawyer.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300"}
                      alt={lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-1 p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold mb-2">
                            {lawyer.name}
                          </h1>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-lg">
                              {lawyer.rating}
                            </span>
                            <span className="text-muted-foreground">
                              ({lawyer.reviewsCount} reseñas)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {lawyer.specialty.map((spec) => (
                          <Badge key={spec} className="capitalize">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Experiencia
                            </p>
                            <p className="font-semibold">{lawyer.experience} años</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-muted/80 p-6 border border-border">
                      <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                        Disponibilidad
                      </p>
                      <p className="text-lg font-semibold">{lawyer.availability}</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Agenda tu consulta fácil y rápido desde esta pantalla.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs con información adicional */}
            <Tabs defaultValue="servicios">
              <TabsList className="w-full">
                <TabsTrigger value="servicios" className="flex-1">
                  Servicios
                </TabsTrigger>
                <TabsTrigger value="resenas" className="flex-1">
                  Reseñas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="servicios" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tipos de consulta disponibles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lawyer.consultationType.map((type) => {
                      const config = consultationConfig[type];
                      const price = lawyer.price ? lawyer.price[type] : undefined;

                      return (
                        <div key={type} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                            {config.emoji}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{config.label}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {config.description}
                            </p>
                            <p className="text-lg font-semibold text-primary">
                              {price !== undefined ? `$${price}` : "Consultar"}/{type.includes("oral") ? "hora" : "consulta"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resenas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reseñas de clientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Formulario de nueva reseña */}
                    <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-border mb-8">
                      <h4 className="font-bold mb-4">Deja tu opinión</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rev-name">Tu nombre</Label>
                            <Input
                              id="rev-name"
                              placeholder="Ej: Juan Pérez"
                              required
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rev-rating">Calificación</Label>
                            <Select value={reviewRating} onValueChange={setReviewRating}>
                              <SelectTrigger id="rev-rating">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5"><span>⭐⭐⭐⭐⭐ (Excelente)</span></SelectItem>
                                <SelectItem value="4"><span>⭐⭐⭐⭐ (Muy bueno)</span></SelectItem>
                                <SelectItem value="3"><span>⭐⭐⭐ (Regular)</span></SelectItem>
                                <SelectItem value="2"><span>⭐⭐ (Malo)</span></SelectItem>
                                <SelectItem value="1"><span>⭐ (Muy malo)</span></SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rev-comment">Tu comentario</Label>
                          <Textarea
                            id="rev-comment"
                            placeholder="Escribe aquí tu experiencia..."
                            required
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={submittingReview} className="w-full md:w-auto">
                          {submittingReview ? "Enviando..." : "Publicar reseña"}
                        </Button>
                      </form>
                    </div>

                    <Separator />

                    {/* Lista de reseñas reales */}
                    <div className="space-y-6 pt-4">
                      {lawyer.reviews && lawyer.reviews.length > 0 ? (
                        lawyer.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-lg">{review.name}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground italic">
                            Aún no hay reseñas para este abogado. ¡Sé el primero en dejar una!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Solicitar consulta */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Solicitar consulta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de consulta */}
                <div>
                  <Label className="mb-3 block">Tipo de consulta *</Label>
                  <RadioGroup
                    value={consultationType}
                    onValueChange={(value) =>
                      setConsultationType(value as ConsultationType)
                    }
                  >
                    {lawyer.consultationType.map((type) => {
                      const config = consultationConfig[type];
                      const price = lawyer.price ? lawyer.price[type] : undefined;

                      return (
                        <div key={type} className="flex items-center space-x-2 border p-3 rounded-lg hover:border-primary transition-colors">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{config.emoji}</span>
                                <span className="text-sm">{config.label}</span>
                              </div>
                              <span className="font-semibold text-sm">
                                {price !== undefined ? `$${price}` : "Consultar"}
                              </span>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Disponibilidad */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{lawyer.availability}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recibirás confirmación en 24 horas
                  </p>
                </div>

                {/* Precio total */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Precio:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${consultationType && lawyer.price ? (lawyer.price[consultationType] ?? "0") : "0"}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleOpenBooking}
                    disabled={!consultationType}
                  >
                    Solicitar consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completa tu información</DialogTitle>
            <DialogDescription>
              Necesitamos algunos datos para agendar tu consulta con {lawyer.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Tus datos</h3>

              <div>
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu correo para recibir notificaciones"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Número de teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej. +54 9 11 1234 5678"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="120"
                  placeholder="Tu edad"
                  value={clientAge}
                  onChange={(e) => setClientAge(e.target.value)}
                />
                {clientAge && (Number(clientAge) < 18 || Number(clientAge) > 120) && (
                  <p className="text-xs text-destructive mt-1">La edad debe estar entre 18 y 120 años.</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Información del caso */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sobre tu caso</h3>

              <div>
                <Label htmlFor="caseType">Tipo de caso *</Label>
                <Select value={caseType} onValueChange={setCaseType}>
                  <SelectTrigger>
                    <SelectValue placeholder={<span>Selecciona el tipo de caso</span>} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil"><span>Civil - Contratos, responsabilidad civil</span></SelectItem>
                    <SelectItem value="penal"><span>Penal - Delitos, denuncias</span></SelectItem>
                    <SelectItem value="laboral"><span>Laboral - Despidos, condiciones laborales</span></SelectItem>
                    <SelectItem value="familiar"><span>Familiar - Divorcios, custodia, herencias</span></SelectItem>
                    <SelectItem value="mercantil"><span>Mercantil - Empresas, comercio</span></SelectItem>
                    <SelectItem value="fiscal"><span>Fiscal - Impuestos, tributos</span></SelectItem>
                    <SelectItem value="inmobiliario"><span>Inmobiliario - Propiedades, alquileres</span></SelectItem>
                    <SelectItem value="administrativo"><span>Administrativo - Trámites, recursos</span></SelectItem>
                    <SelectItem value="unknown"><span>No sé cual es mi tipo de caso</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción del caso *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu situación legal con el mayor detalle posible..."
                  rows={4}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Incluye fechas, eventos importantes y cualquier información relevante
                </p>
              </div>
            </div>

            <Separator />

            {/* Selección de fecha y hora */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda tu cita
              </h3>

              <div>
                <Label className="mb-3 block">Selecciona un día *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedDate === slot.date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(""); // Reset time when changing date
                      }}
                      className="w-full text-xs"
                    >
                      {slot.date}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <Label className="mb-3 block">Selecciona un horario *</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots
                      .find(slot => slot.date === selectedDate)
                      ?.times.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className="w-full text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Resumen */}
            {canProceed() && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resumen de tu consulta</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><strong>Tipo:</strong> {consultationType && consultationConfig[consultationType].label}</p>
                  <p><strong>Fecha:</strong> {selectedDate} a las {selectedTime}</p>
                  <p><strong>Precio:</strong> ${consultationType && lawyer.price ? (lawyer.price[consultationType] ?? "0") : "0"}</p>
                </div>
              </div>
            )}

            {/* Botón de continuar */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmitBooking}
              disabled={!canProceed()}
            >
              Continuar al pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Widget */}
      <ChatbotWidget />
      <Footer />
    </div>
  );
}
