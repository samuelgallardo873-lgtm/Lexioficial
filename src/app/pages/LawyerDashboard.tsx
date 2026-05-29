import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { scrollToTop } from "../../lib/scroll";
import { Scale, Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function LawyerDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [consultationType, setConsultationType] = useState<string[]>([]);
  const [schedule, setSchedule] = useState({
    presencial: { days: [] as string[], hours: [] as string[] },
    virtual: { days: [] as string[], hours: [] as string[] },
  });

  useEffect(() => {
    scrollToTop();
    if (user && !user.isLawyer) {
      toast.error("Acceso denegado", { description: "Esta sección es solo para abogados." });
      navigate("/");
      return;
    }

    if (user && token) {
      fetchLawyerData();
    } else if (user === null) {
      navigate("/login");
    }
  }, [user, navigate, token]);

  const fetchLawyerData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/lawyers/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConsultationType(data.consultationType || []);
        if (data.schedule) {
          setSchedule(data.schedule);
        }
      } else {
        toast.error("No se pudo cargar el perfil del abogado.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (type: "presencial" | "virtual", field: "days" | "hours", value: string) => {
    setSchedule((prev) => {
      const current = prev[type][field];
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: { ...prev[type], [field]: current.filter((i) => i !== value) },
        };
      } else {
        return {
          ...prev,
          [type]: { ...prev[type], [field]: [...current, value] },
        };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/lawyers/me/schedule`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ schedule }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el horario.");
      }

      toast.success("¡Horario actualizado con éxito!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mi Panel de Abogado</h1>
              <p className="text-muted-foreground">Gestiona tus días y horarios de atención</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurar Agenda</CardTitle>
              <CardDescription>
                Actualiza los días y rangos horarios en los que estás disponible para atender consultas. 
                Los cambios se reflejarán instantáneamente en tu perfil público.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {consultationType.some(t => t.includes('presencial')) && (
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
                            variant={schedule.presencial.days.includes(day) ? "default" : "outline"}
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
                            variant={schedule.presencial.hours.includes(hour) ? "default" : "outline"}
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

              {consultationType.some(t => t.includes('videollamada')) && (
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
                            variant={schedule.virtual.days.includes(day) ? "default" : "outline"}
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
                            variant={schedule.virtual.hours.includes(hour) ? "default" : "outline"}
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

              <Button onClick={handleSave} disabled={saving} className="w-full mt-6">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Horario
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
