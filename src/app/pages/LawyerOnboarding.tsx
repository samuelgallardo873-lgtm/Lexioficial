import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../lib/scroll";
import {
  Scale,
  ArrowLeft,
  CheckCircle,
  Upload,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { specialties } from "../data/lawyers";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function LawyerOnboarding() {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  useEffect(() => {
    setTimeout(scrollToTop, 10);
  }, []);

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    matricula: "",
    experience: "",
    description: "",
    image: "",
    specialty: [] as string[],
    consultationType: [] as string[],
    price: {
      "oral-presencial": "",
      "escrita-presencial": "",
      "oral-videollamada": "",
      "escrita-videollamada": "",
    },
    schedule: {
      presencial: { days: [] as string[], hours: [] as string[] },
      virtual: { days: [] as string[], hours: [] as string[] },
    },
    languages: "",
    availability: "Disponible ahora",
  });

  // Sync formData when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email
      }));
    }
  }, [user]);

  const handleScheduleChange = (type: "presencial" | "virtual", field: "days" | "hours", value: string) => {
    setFormData((prev) => {
      const current = prev.schedule[type][field];
      if (current.includes(value)) {
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            [type]: { ...prev.schedule[type], [field]: current.filter((i) => i !== value) },
          },
        };
      } else {
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            [type]: { ...prev.schedule[type], [field]: [...current, value] },
          },
        };
      }
    });
  };

  const handleCheckboxChange = (field: "specialty" | "consultationType", value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((i) => i !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handlePriceChange = (type: string, value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, "");
    
    // Format with dots
    const formattedValue = numericValue ? Number(numericValue).toLocaleString("es-AR") : "";

    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [type]: formattedValue },
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Imagen demasiado grande", {
        description: "El tamaño máximo permitido es de 50MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
      toast.success("Foto cargada localmente con éxito");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      if (formData.consultationType.length === 0) {
        throw new Error("Debes seleccionar al menos un tipo de consulta.");
      }

      for (const type of formData.consultationType) {
        if (!formData.price[type as keyof typeof formData.price]) {
          throw new Error("Debes definir el precio para todos los tipos de consulta que seleccionaste.");
        }
      }

      // Formatear datos para el backend
      const dataToSend = {
        ...formData,
        experience: Number(formData.experience),
        languages: formData.languages.split(",").map(l => l.trim()).filter(Boolean),
        price: Object.fromEntries(
          Object.entries(formData.price)
            .filter(([_, v]) => v !== "")
            .map(([k, v]) => [k, Number(v.replace(/\D/g, ""))])
        )
      };

      const response = await fetch(`${apiUrl}/api/lawyers/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (código ${response.status})`);
      }

      setSuccess(true);
      toast.success("¡Guardado en la base con éxito!", {
        description: "El perfil del abogado fue registrado correctamente.",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido al guardar los datos";
      setSubmitError(msg);
      toast.error("No se pudo guardar el perfil", {
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Perfil Registrado!</h2>
          <p className="text-muted-foreground mb-6">
            Tus datos han sido enviados a un administrador para ser revisados. 
            Te notificaremos una vez que tu perfil sea aprobado y esté visible.
            {!user && <br />}
            {!user && <span className="font-semibold text-primary mt-2 block">También hemos creado tu cuenta de usuario. ¡Ya puedes iniciar sesión!</span>}
          </p>
          <Button className="w-full" onClick={() => window.location.href = "/"}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
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
              <span className="text-xl font-semibold">Lexi For Lawyers</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Completa tu Perfil Profesional</h1>
            <p className="text-muted-foreground">
              Esta información será visible para los clientes que buscan asesoría legal.
            </p>
          </div>

          {!user && (
            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <p className="font-semibold text-primary">Al hacer esto se creará tu cuenta en la página</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hemos añadido un campo de contraseña abajo. Crearemos automáticamente tu cuenta de usuario para que puedas iniciar sesión en tu Panel de Abogado. Si ya tienes una cuenta, por favor <Link to="/login" className="underline font-semibold text-primary">inicia sesión primero</Link>.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos Básicos */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Dra. Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Profesional</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      disabled={!!user}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {user && <p className="text-xs text-muted-foreground">Enlazado a tu cuenta actual.</p>}
                  </div>
                </div>

                {!user && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña para tu cuenta</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Crea una contraseña segura"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricula">Matrícula Profesional (Obligatoria)</Label>
                    <Input
                      id="matricula"
                      placeholder="Ej: T° 123 F° 456 (CSJN)"
                      required
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Años de Experiencia</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="Ej: 10"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Foto de Perfil (Opcional)</Label>
                  <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="image-file" className="text-xs text-muted-foreground">Subir archivo local</Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-xs text-muted-foreground">O pegar URL de imagen</Label>
                      <Input
                        id="image"
                        placeholder="https://..."
                        value={formData.image.startsWith("data:") ? "" : formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-4 p-3 border rounded-lg bg-background w-fit">
                      <img
                        src={formData.image}
                        alt="Vista previa"
                        className="w-16 h-16 object-cover rounded-full border"
                      />
                      <div>
                        <p className="text-xs font-medium">Vista previa de tu foto</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive h-auto p-0 mt-1"
                          onClick={() => setFormData({ ...formData, image: "" })}
                        >
                          Quitar foto
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Profesional</Label>
                  <Textarea
                    id="description"
                    placeholder="Cuéntanos sobre tu trayectoria y especialidades..."
                    className="min-h-[120px]"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Idiomas (separados por coma)</Label>
                  <Input
                    id="languages"
                    placeholder="Español, Inglés, Francés"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle>Especialidades Legales</CardTitle>
                <CardDescription>Selecciona todas las áreas en las que te especializas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {specialties.map((s) => (
                    <div key={s.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`s-${s.id}`}
                        checked={formData.specialty.includes(s.id)}
                        onCheckedChange={() => handleCheckboxChange("specialty", s.id)}
                      />
                      <Label htmlFor={`s-${s.id}`} className="cursor-pointer">
                        {s.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Consulta y Precios */}
            <Card>
              <CardHeader>
                <CardTitle>Consultas y Precios</CardTitle>
                <CardDescription>Define qué servicios ofreces y sus costos base (en USD).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {[
                    { id: "oral-presencial", label: "Consulta Oral Presencial" },
                    { id: "escrita-presencial", label: "Consulta Escrita Presencial" },
                    { id: "oral-videollamada", label: "Consulta Oral Virtual" },
                    { id: "escrita-videollamada", label: "Consulta Escrita Virtual" },
                  ].map((type) => (
                    <div key={type.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-background">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`t-${type.id}`}
                          checked={formData.consultationType.includes(type.id)}
                          onCheckedChange={() => handleCheckboxChange("consultationType", type.id)}
                        />
                        <Label htmlFor={`t-${type.id}`} className="font-medium cursor-pointer">
                          {type.label}
                        </Label>
                      </div>
                      {formData.consultationType.includes(type.id) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">$</span>
                          <Input
                            type="text"
                            placeholder="Precio"
                            className="w-24"
                            value={formData.price[type.id as keyof typeof formData.price]}
                            onChange={(e) => handlePriceChange(type.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Horarios y Disponibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Días y Horarios de Atención</CardTitle>
                <CardDescription>
                  Selecciona los días y rangos horarios en los que estás disponible para atender consultas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {formData.consultationType.some(t => t.includes('presencial')) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">🏢</span>
                      Consultas Presenciales
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                      <div>
                        <Label className="mb-2 block text-muted-foreground">Días disponibles</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                            <Button
                              key={`p-day-${day}`}
                              type="button"
                              variant={formData.schedule.presencial.days.includes(day) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleScheduleChange("presencial", "days", day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block text-muted-foreground">Horarios disponibles</Label>
                        <div className="flex flex-wrap gap-2">
                          {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((hour) => (
                            <Button
                              key={`p-hour-${hour}`}
                              type="button"
                              variant={formData.schedule.presencial.hours.includes(hour) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleScheduleChange("presencial", "hours", hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.consultationType.some(t => t.includes('videollamada')) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">💻</span>
                      Consultas Virtuales
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                      <div>
                        <Label className="mb-2 block text-muted-foreground">Días disponibles</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                            <Button
                              key={`v-day-${day}`}
                              type="button"
                              variant={formData.schedule.virtual.days.includes(day) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleScheduleChange("virtual", "days", day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block text-muted-foreground">Horarios disponibles</Label>
                        <div className="flex flex-wrap gap-2">
                          {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((hour) => (
                            <Button
                              key={`v-hour-${hour}`}
                              type="button"
                              variant={formData.schedule.virtual.hours.includes(hour) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleScheduleChange("virtual", "hours", hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Banner de error */}
            {submitError && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                <span className="text-xl mt-0.5">❌</span>
                <div>
                  <p className="font-semibold text-sm">No se pudo guardar el perfil</p>
                  <p className="text-sm opacity-80 mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Guardando datos...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  <span>Guardar Perfil Profesional</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
