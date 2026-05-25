import { useState } from "react";
import { Link } from "react-router-dom";
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

export function LawyerOnboarding() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    languages: "",
    availability: "Disponible ahora",
  });

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
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [type]: value },
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagen demasiado grande", {
        description: "El tamaño máximo permitido es de 2MB.",
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
            .map(([k, v]) => [k, Number(v)])
        )
      };

      const response = await fetch("/api/lawyers/update", {
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
          <CardTitle className="text-2xl mb-2">¡Perfil en revisión!</CardTitle>
          <CardDescription className="text-lg mb-8">
            Tus datos han sido guardados. Un administrador validará tu matrícula antes de que el perfil sea publicado en Lexi.
          </CardDescription>
          <Button asChild className="w-full">
            <Link to="/">Ir al inicio</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b sticky top-0 z-10">
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

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
                            type="number"
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
                  Guardando datos...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Guardar Perfil Profesional
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
