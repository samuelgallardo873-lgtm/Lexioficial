import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, X, ShieldAlert, ShieldCheck, Loader2, Trash2, LogOut, MessageCircle, Calendar, DollarSign, Users, Download, FileText, Search, Activity, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "sonner";
import { Lawyer } from "../data/lawyers";
import { useAuth } from "../context/AuthContext";

export function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");

  const navigate = useNavigate();

  const fetchAllLawyers = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/lawyers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
 
      const bookingsResponse = await fetch(`${apiUrl}/api/admin/bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/");
        return;
      }

      if (!response.ok || !bookingsResponse.ok) throw new Error("Error fetching data");
      
      const data = await response.json();
      const bookingsData = await bookingsResponse.json();
      
      // Ordenar citas por fecha de creación (más recientes primero)
      const sortedBookings = bookingsData.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.selectedDate).getTime();
        const dateB = new Date(b.createdAt || b.selectedDate).getTime();
        return dateB - dateA;
      });

      setLawyers(data);
      setBookings(sortedBookings);
    } catch (error) {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate("/");
      } else {
        fetchAllLawyers();
      }
    }
  }, [user, authLoading, navigate, token]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const response = await fetch(`${apiUrl}/api/admin/lawyers/${id}/${action}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
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
      const response = await fetch(`${apiUrl}/api/admin/lawyers/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
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

  // Cálculos Financieros
  const { currentMonthRevenue, totalRevenue, totalBookingsCount } = useMemo(() => {
    let currentMonth = 0;
    let total = 0;
    
    const now = new Date();
    const currentMonthNum = now.getMonth();
    const currentYearNum = now.getFullYear();

    bookings.forEach((booking: any) => {
      const amount = Number(booking.paymentAmount) || 0;
      total += amount;

      const bookingDate = new Date(booking.createdAt || booking.selectedDate);
      if (!isNaN(bookingDate.getTime())) {
        if (bookingDate.getMonth() === currentMonthNum && bookingDate.getFullYear() === currentYearNum) {
          currentMonth += amount;
        }
      } else {
        if (booking.selectedDate && typeof booking.selectedDate === 'string') {
           const parts = booking.selectedDate.split('-');
           if (parts.length === 3) {
             const month = parseInt(parts[1]) - 1;
             const year = parseInt(parts[0]);
             if (month === currentMonthNum && year === currentYearNum) {
                currentMonth += amount;
             }
           }
        }
      }
    });

    return {
      currentMonthRevenue: currentMonth,
      totalRevenue: total,
      totalBookingsCount: bookings.length
    };
  }, [bookings]);

  // Filtro de Reservas
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: any) => {
      const matchesSearch = booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            booking.lawyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesMonth = true;
      if (filterMonth !== "all") {
        if (booking.selectedDate && typeof booking.selectedDate === 'string') {
          const parts = booking.selectedDate.split('-');
          if (parts.length >= 2) {
            matchesMonth = parts[1] === filterMonth;
          }
        }
      }
      
      return matchesSearch && matchesMonth;
    });
  }, [bookings, searchTerm, filterMonth]);

  const exportToCSV = () => {
    if (bookings.length === 0) {
      toast.error("No hay registros para exportar");
      return;
    }

    const headers = ["Cliente", "Abogado", "Fecha", "Hora", "Monto", "Tipo Consulta", "Estado"];
    const rows = bookings.map(b => [
      `"${b.clientName || ''}"`,
      `"${b.lawyerId?.name || 'Abogado Eliminado'}"`,
      `"${b.selectedDate || ''}"`,
      `"${b.selectedTime || ''}"`,
      b.paymentAmount || 0,
      `"${b.consultationType || ''}"`,
      `"Pagado"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registros_lexi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleWhatsAppNotify = (booking: any) => {
    const lawyerPhone = booking.lawyerId?.phone || "NO_PHONE_PROVIDED";
    const lawyerName = booking.lawyerId?.name || "Abogado";
    const message = `Hola Dr/a. ${lawyerName}, soy el administrador de Lexi. Te escribo para notificarte que el cliente *${booking.clientName}* acaba de realizar el pago del anticipo y agendó una consulta (${booking.consultationType}) contigo para el *${booking.selectedDate} a las ${booking.selectedTime}*. Revisa tu correo electrónico para más detalles. ¡Gracias!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${lawyerPhone}?text=${encodedMessage}`, '_blank');
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
              <span className="text-xl font-semibold hidden sm:inline">Panel de Administración</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gestión y Estadísticas</h1>
            <p className="text-muted-foreground">
              Revisa tus ingresos, gestiona el historial de citas y aprueba perfiles de abogados.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-5 mb-8 h-auto p-1">
                <TabsTrigger value="overview" className="flex flex-col sm:flex-row gap-2 py-3">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Resumen</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex flex-col sm:flex-row gap-2 py-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs sm:text-sm flex items-center gap-1">
                    Citas
                    {bookings.length > 0 && (
                      <span className="bg-indigo-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5">
                        {bookings.length}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex flex-col sm:flex-row gap-2 py-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs sm:text-sm flex items-center gap-1">
                    Pendientes
                    {pendingLawyers.length > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5">
                        {pendingLawyers.length}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex flex-col sm:flex-row gap-2 py-3">
                  <Check className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Aprobados</span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex flex-col sm:flex-row gap-2 py-3">
                  <X className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Rechazados</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/50 backdrop-blur-sm border-emerald-100/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Ingresos del Mes
                      </CardTitle>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-700">${currentMonthRevenue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Tu ganancia de anticipos este mes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/50 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Ingresos Totales (Histórico)
                      </CardTitle>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Acumulado histórico</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total de Citas
                      </CardTitle>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalBookingsCount}</div>
                      <p className="text-xs text-muted-foreground mt-1">Citas agendadas en total</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Abogados en Plataforma
                      </CardTitle>
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-amber-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{approvedLawyers.length}</div>
                      <p className="text-xs text-amber-600 mt-1 font-medium">{pendingLawyers.length} solicitudes pendientes</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          Historial de Citas y Pagos
                        </CardTitle>
                        <CardDescription>
                          Registro completo de todas las consultas agendadas.
                        </CardDescription>
                      </div>
                      <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exportar a Excel/CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          placeholder="Buscar por cliente o abogado..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select 
                        className="flex h-10 w-full sm:w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                      >
                        <option value="all">Todos los meses</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                      </select>
                    </div>

                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-12 border border-dashed rounded-lg">
                        <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium">No se encontraron citas</h3>
                        <p className="text-muted-foreground">Prueba ajustando los filtros de búsqueda.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Abogado Asignado</TableHead>
                              <TableHead>Fecha / Hora</TableHead>
                              <TableHead>Ingreso (Anticipo)</TableHead>
                              <TableHead>Tipo de Consulta</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredBookings.map((booking: any) => (
                              <TableRow key={booking._id}>
                                <TableCell className="font-medium">
                                  {booking.clientName}
                                </TableCell>
                                <TableCell>
                                  {booking.lawyerId?.name || <span className="text-destructive text-sm italic">Eliminado</span>}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{booking.selectedDate}</span>
                                    <span className="text-xs text-muted-foreground">{booking.selectedTime}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-bold text-emerald-600">${booking.paymentAmount}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="capitalize px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                                    {booking.consultationType.replace("-", " ")}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    className="text-[#25D366] hover:text-[#20bd5a] hover:bg-[#25D366]/10"
                                    onClick={() => handleWhatsAppNotify(booking)}
                                    title="Notificar por WhatsApp al abogado"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

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
