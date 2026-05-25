import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, ShieldAlert, ShieldCheck, Loader2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { Lawyer } from "../data/lawyers";

export function AdminDashboard() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAllLawyers = async () => {
    try {
      const response = await fetch("/api/admin/lawyers");
      if (!response.ok) throw new Error("Error fetching lawyers");
      const data = await response.json();
      setLawyers(data);
    } catch (error) {
      toast.error("Error al cargar los abogados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLawyers();
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
      
      fetchAllLawyers();
    } catch (error) {
      toast.error("Hubo un problema al procesar la solicitud");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este abogado de la base de datos de forma definitiva? Esta acción no se puede deshacer.")) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/lawyers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      
      toast.success("Abogado eliminado permanentemente de la base de datos.");
      fetchAllLawyers();
    } catch (error) {
      toast.error("Hubo un problema al eliminar el abogado");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingLawyers = lawyers.filter(l => l.status === "pending");
  const approvedLawyers = lawyers.filter(l => l.status === "approved");
  const rejectedLawyers = lawyers.filter(l => l.status === "rejected");

  const renderLawyerCard = (lawyer: Lawyer) => (
    <Card key={lawyer.id} className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{lawyer.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {lawyer.email}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
              Matrícula: {lawyer.matricula}
            </div>
            <div className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
              lawyer.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
              lawyer.status === 'rejected' ? 'bg-destructive/10 text-destructive' : 
              'bg-amber-100 text-amber-800'
            }`}>
              {lawyer.status === 'approved' ? 'Aprobado' : lawyer.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
            </div>
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
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <strong className="block text-muted-foreground mb-1 text-sm">Descripción</strong>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {lawyer.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
              {lawyer.status !== "approved" && (
                <Button 
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                  onClick={() => handleAction(lawyer.id, "approve")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === lawyer.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Aprobar
                </Button>
              )}
              {lawyer.status !== "rejected" && (
                <Button 
                  size="sm"
                  variant="outline" 
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(lawyer.id, "reject")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === lawyer.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                  Rechazar
                </Button>
              )}
              <Button 
                size="sm"
                variant="destructive" 
                className="flex-none px-3"
                onClick={() => handleDelete(lawyer.id)}
                disabled={actionLoading !== null}
                title="Eliminar de la base de datos"
              >
                {actionLoading === lawyer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <h1 className="text-3xl font-bold mb-2">Gestión de Abogados</h1>
            <p className="text-muted-foreground">
              Revisa solicitudes pendientes, aprueba perfiles y gestiona el directorio de la plataforma.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="pending" className="flex gap-2">
                  Pendientes
                  {pendingLawyers.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingLawyers.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex gap-2">
                  Aprobados
                  <span className="bg-muted-foreground/20 text-muted-foreground text-xs rounded-full px-2 py-0.5">
                    {approvedLawyers.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex gap-2">
                  Rechazados
                  <span className="bg-muted-foreground/20 text-muted-foreground text-xs rounded-full px-2 py-0.5">
                    {rejectedLawyers.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-6">
                {pendingLawyers.length === 0 ? (
                  <Card className="text-center py-16 border-dashed bg-transparent shadow-none">
                    <CardContent>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl mb-2">Todo al día</CardTitle>
                      <CardDescription>No hay solicitudes de abogados pendientes de aprobación.</CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  pendingLawyers.map(renderLawyerCard)
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                {approvedLawyers.length === 0 ? (
                  <Card className="text-center py-12 border-dashed bg-transparent shadow-none">
                    <CardContent>
                      <CardDescription>No hay abogados aprobados en la plataforma.</CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  approvedLawyers.map(renderLawyerCard)
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                {rejectedLawyers.length === 0 ? (
                  <Card className="text-center py-12 border-dashed bg-transparent shadow-none">
                    <CardContent>
                      <CardDescription>No hay solicitudes rechazadas.</CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  rejectedLawyers.map(renderLawyerCard)
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
