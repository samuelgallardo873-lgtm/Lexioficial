import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { toast } from "sonner";
import { Lawyer } from "../data/lawyers";

export function AdminDashboard() {
  const [pendingLawyers, setPendingLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingLawyers = async () => {
    try {
      const response = await fetch("/api/admin/lawyers/pending");
      if (!response.ok) throw new Error("Error fetching pending lawyers");
      const data = await response.json();
      setPendingLawyers(data);
    } catch (error) {
      toast.error("Error al cargar las solicitudes pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/lawyers/${id}/${action}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error(`Error al ${action === "approve" ? "aprobar" : "rechazar"}`);
      
      toast.success(
        action === "approve" 
          ? "Abogado aprobado correctamente. Ya es visible en la plataforma."
          : "Solicitud de abogado rechazada."
      );
      
      // Refresh list
      fetchPendingLawyers();
    } catch (error) {
      toast.error("Hubo un problema al procesar la solicitud");
    } finally {
      setActionLoading(null);
    }
  };

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
              <ShieldAlert className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">Panel de Administración</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Solicitudes Pendientes de Abogados</h1>
            <p className="text-muted-foreground">
              Revisa y corrobora la matrícula de los abogados antes de permitir su ingreso a Lexi.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingLawyers.length === 0 ? (
            <Card className="text-center py-16 border-dashed bg-transparent shadow-none">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl mb-2">Todo al día</CardTitle>
                <CardDescription>
                  No hay solicitudes de abogados pendientes de aprobación.
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{lawyer.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {lawyer.email}
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                        Matrícula: {lawyer.matricula}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4 text-sm">
                        <div>
                          <strong className="block text-muted-foreground mb-1">Especialidades</strong>
                          <p>{lawyer.specialty?.join(", ") || "No especificadas"}</p>
                        </div>
                        <div>
                          <strong className="block text-muted-foreground mb-1">Experiencia</strong>
                          <p>{lawyer.experience} años</p>
                        </div>
                        <div>
                          <strong className="block text-muted-foreground mb-1">Tipos de consulta</strong>
                          <p>{lawyer.consultationType?.join(", ") || "No especificados"}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <strong className="block text-muted-foreground mb-1 text-sm">Descripción</strong>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {lawyer.description}
                          </p>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t mt-4">
                          <Button 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                            onClick={() => handleAction(lawyer.id, "approve")}
                            disabled={actionLoading !== null}
                          >
                            {actionLoading === lawyer.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Aprobar
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(lawyer.id, "reject")}
                            disabled={actionLoading !== null}
                          >
                            {actionLoading === lawyer.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <X className="w-4 h-4 mr-2" />
                            )}
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
