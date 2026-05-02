import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";

interface CaseFormData {
  // Perfil del Solicitante
  name: string;
  age: string;
  city: string;
  country: string;

  // Detalles del Conflicto
  caseTitle: string;
  caseType: string;
  caseDescription: string;

  // Cuantía y Sujetos
  amountInvolved: string;
  hasAmount: boolean;
  counterpartyName: string;

  // Logística
  urgency: string;
  contactMethod: string;
  availability: string;
}

interface CaseMatchingFormProps {
  onComplete: (formData: CaseFormData) => void;
}

export function CaseMatchingForm({ onComplete }: CaseMatchingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CaseFormData>({
    name: "",
    age: "",
    city: "",
    country: "",
    caseTitle: "",
    caseType: "",
    caseDescription: "",
    amountInvolved: "",
    hasAmount: false,
    counterpartyName: "",
    urgency: "",
    contactMethod: "",
    availability: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.city && formData.country;
      case 2:
        return (
          formData.caseTitle && formData.caseType && formData.caseDescription
        );
      case 3:
        return true; // Opcional
      case 4:
        return formData.urgency && formData.contactMethod && formData.availability;
      default:
        return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>Encuentra tu abogado ideal</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Completa la información de tu caso y te recomendaremos los mejores
          abogados
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Paso {step} de {totalSteps}
            </span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Paso 1: Perfil del Solicitante */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">
              Perfil del Solicitante
            </h3>
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="age">Edad *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="Ej: 35"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="Ej: Madrid"
                />
              </div>
              <div>
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateFormData("country", e.target.value)}
                  placeholder="Ej: España"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Detalles del Conflicto */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">
              Detalles del Conflicto
            </h3>
            <div>
              <Label htmlFor="caseTitle">Título del caso *</Label>
              <Input
                id="caseTitle"
                value={formData.caseTitle}
                onChange={(e) => updateFormData("caseTitle", e.target.value)}
                placeholder="Ej: Disputa por herencia familiar"
              />
            </div>
            <div>
              <Label htmlFor="caseType">Tipo de caso *</Label>
              <Select
                value={formData.caseType}
                onValueChange={(value) => updateFormData("caseType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de caso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civil">Civil - Contratos, responsabilidad civil, reclamaciones</SelectItem>
                  <SelectItem value="penal">Penal - Delitos, denuncias, defensa criminal</SelectItem>
                  <SelectItem value="laboral">Laboral - Despidos, condiciones de trabajo, contratos</SelectItem>
                  <SelectItem value="familiar">Familiar - Divorcios, custodia, herencias</SelectItem>
                  <SelectItem value="mercantil">Mercantil - Empresas, comercio, sociedades</SelectItem>
                  <SelectItem value="fiscal">Fiscal - Impuestos, tributos, obligaciones fiscales</SelectItem>
                  <SelectItem value="inmobiliario">Inmobiliario - Propiedades, alquileres, compraventa</SelectItem>
                  <SelectItem value="administrativo">Administrativo - Trámites, recursos, administración pública</SelectItem>
                  <SelectItem value="unknown">No conozco cual es mi tipo de caso</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Si no estás seguro del tipo de caso, selecciona la última opción y te ayudaremos
              </p>
            </div>
            <div>
              <Label htmlFor="caseDescription">Descripción del caso *</Label>
              <Textarea
                id="caseDescription"
                value={formData.caseDescription}
                onChange={(e) =>
                  updateFormData("caseDescription", e.target.value)
                }
                placeholder="Describe tu situación legal con el mayor detalle posible..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Incluye fechas, eventos importantes y cualquier documentación
                relevante
              </p>
            </div>
          </div>
        )}

        {/* Paso 3: Cuantía y Sujetos */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Cuantía y Sujetos</h3>
            <div>
              <Label className="mb-3 block">
                ¿Hay dinero involucrado en el caso?
              </Label>
              <RadioGroup
                value={formData.hasAmount ? "yes" : "no"}
                onValueChange={(value) =>
                  updateFormData("hasAmount", value === "yes")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="amount-yes" />
                  <Label htmlFor="amount-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="amount-no" />
                  <Label htmlFor="amount-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            {formData.hasAmount && (
              <div>
                <Label htmlFor="amountInvolved">Cantidad aproximada</Label>
                <Input
                  id="amountInvolved"
                  value={formData.amountInvolved}
                  onChange={(e) =>
                    updateFormData("amountInvolved", e.target.value)
                  }
                  placeholder="Ej: 50000"
                  type="number"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  En tu moneda local
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="counterpartyName">
                Nombre de la contraparte (opcional)
              </Label>
              <Input
                id="counterpartyName"
                value={formData.counterpartyName}
                onChange={(e) =>
                  updateFormData("counterpartyName", e.target.value)
                }
                placeholder="Ej: Empresa XYZ S.A."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Persona o entidad contra la que tienes el conflicto
              </p>
            </div>
          </div>
        )}

        {/* Paso 4: Logística */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Logística</h3>
            <div>
              <Label htmlFor="urgency">Nivel de urgencia *</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => updateFormData("urgency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">
                    Inmediata (necesito ayuda hoy)
                  </SelectItem>
                  <SelectItem value="high">
                    Alta (en los próximos 2-3 días)
                  </SelectItem>
                  <SelectItem value="medium">
                    Media (en la próxima semana)
                  </SelectItem>
                  <SelectItem value="low">
                    Baja (tengo tiempo, no hay prisa)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactMethod">Modalidad de consulta *</Label>
              <Select
                value={formData.contactMethod}
                onValueChange={(value) => updateFormData("contactMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="¿Cómo prefieres realizar la consulta?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="videocall">
                    💬 Videollamada
                  </SelectItem>
                  <SelectItem value="in-person">👤 En persona</SelectItem>
                  <SelectItem value="both">Cualquiera de las dos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="availability">Disponibilidad horaria *</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) => updateFormData("availability", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="¿Cuándo estás disponible?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">
                    Mañanas (8:00 - 12:00)
                  </SelectItem>
                  <SelectItem value="afternoon">
                    Tardes (12:00 - 18:00)
                  </SelectItem>
                  <SelectItem value="evening">
                    Noches (18:00 - 22:00)
                  </SelectItem>
                  <SelectItem value="flexible">Horario flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          ) : (
            <div />
          )}
          {step < totalSteps ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()}>
              <Sparkles className="w-4 h-4 mr-2" />
              Encontrar abogados
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
