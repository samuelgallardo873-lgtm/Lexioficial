import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { LawyerCard } from "../components/LawyerCard";
import { Lawyer, specialties } from "../data/lawyers";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Footer } from "../components/Footer";

export function FindLawyer() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedConsultationType, setSelectedConsultationType] =
    useState<string>("all");

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch("/api/lawyers");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los abogados");
        }
        const data = await response.json();
        setLawyers(data);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const specialtyMatch =
      selectedSpecialty === "all" ||
      lawyer.specialty.includes(selectedSpecialty);
    const consultationMatch =
      selectedConsultationType === "all" ||
      lawyer.consultationType.some(type => type.includes(selectedConsultationType));
    return specialtyMatch && consultationMatch;
  });

  const displayedLawyers = filteredLawyers.map((lawyer) => ({ lawyer, score: null, matchReasons: [] }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-medium">Cargando abogados...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg font-medium text-destructive">
          Error: {fetchError}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">Lexi</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Filtrar abogados</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tipo de consulta */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Tipo de consulta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={
                      selectedConsultationType === "all" ? "default" : "outline"
                    }
                    onClick={() => setSelectedConsultationType("all")}
                    className="w-full"
                  >
                    Todas
                  </Button>
                  <Button
                    variant={
                      selectedConsultationType === "oral" ? "default" : "outline"
                    }
                    onClick={() => setSelectedConsultationType("oral")}
                    className="w-full flex items-center gap-1"
                  >
                    <span>💬</span>
                    Oral
                  </Button>
                  <Button
                    variant={
                      selectedConsultationType === "escrita"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedConsultationType("escrita")}
                    className="w-full flex items-center gap-1"
                  >
                    <span>📝</span>
                    Escrita
                  </Button>
                  <Button
                    variant={
                      selectedConsultationType === "videollamada"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedConsultationType("videollamada")}
                    className="w-full flex items-center gap-1"
                  >
                    <span>📹</span>
                    Virtual
                  </Button>
                  <Button
                    variant={
                      selectedConsultationType === "presencial"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedConsultationType("presencial")}
                    className="w-full flex items-center gap-1"
                  >
                    <span>👤</span>
                    Presencial
                  </Button>
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Especialidad legal
                </label>
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las especialidades</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Especialidades como badges */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                O selecciona una especialidad:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedSpecialty === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSpecialty("all")}
                >
                  Todas
                </Badge>
                {specialties.map((specialty) => (
                  <Badge
                    key={specialty.id}
                    variant={
                      selectedSpecialty === specialty.id ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedSpecialty(specialty.id)}
                  >
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">
            {displayedLawyers.length} abogado
            {displayedLawyers.length !== 1 ? "s" : ""} disponible
            {displayedLawyers.length !== 1 ? "s" : ""}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedLawyers.map((item, index) => (
            <div key={item.lawyer.id} className="relative">
              {item.score !== null && index < 3 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-background">
                    <div className="text-center">
                      <div className="text-xs font-bold">{item.score}%</div>
                    </div>
                  </div>
                </div>
              )}
              <LawyerCard lawyer={item.lawyer} matchReasons={item.matchReasons} />
            </div>
          ))}
        </div>

        {displayedLawyers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No se encontraron abogados con los filtros seleccionados.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSpecialty("all");
                setSelectedConsultationType("all");
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
      <Footer />
    </div>
  );
}