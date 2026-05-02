import { Lawyer } from "../data/lawyers";

interface CaseFormData {
  name: string;
  age: string;
  city: string;
  country: string;
  caseTitle: string;
  caseType: string;
  caseDescription: string;
  amountInvolved: string;
  hasAmount: boolean;
  counterpartyName: string;
  urgency: string;
  contactMethod: string;
  availability: string;
}

interface LawyerMatch {
  lawyer: Lawyer;
  score: number;
  matchReasons: string[];
}

/**
 * Sistema inteligente de matching que analiza el caso del cliente
 * y recomienda los mejores abogados basándose en múltiples factores
 */
export function matchLawyersToCase(
  caseData: CaseFormData,
  lawyers: Lawyer[]
): LawyerMatch[] {
  const matches: LawyerMatch[] = lawyers.map((lawyer) => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Especialidad (peso: 40 puntos)
    if (lawyer.specialty.includes(caseData.caseType)) {
      score += 40;
      matchReasons.push(
        `Especialista en ${caseData.caseType.charAt(0).toUpperCase() + caseData.caseType.slice(1)}`
      );
    } else {
      // Penalización si no tiene la especialidad exacta
      score -= 10;
    }

    // 2. Tipo de consulta preferido (peso: 20 puntos)
    if (caseData.contactMethod === "both") {
      // Si el cliente acepta cualquiera, dar preferencia a abogados que ofrecen ambas
      if (
        lawyer.consultationType.includes("oral") &&
        lawyer.consultationType.includes("written")
      ) {
        score += 20;
        matchReasons.push("Ofrece consultas orales y escritas");
      } else {
        score += 10;
      }
    } else if (
      lawyer.consultationType.includes(
        caseData.contactMethod as "oral" | "written"
      )
    ) {
      score += 20;
      matchReasons.push(
        `Disponible para consulta ${caseData.contactMethod === "oral" ? "oral" : "escrita"}`
      );
    }

    // 3. Urgencia y disponibilidad (peso: 15 puntos)
    if (caseData.urgency === "immediate" || caseData.urgency === "high") {
      if (lawyer.availability.includes("Disponible hoy")) {
        score += 15;
        matchReasons.push("Disponibilidad inmediata");
      } else if (lawyer.availability.includes("mañana")) {
        score += 10;
      }
    } else {
      // Para casos no urgentes, todos los abogados son igualmente válidos
      score += 10;
    }

    // 4. Experiencia (peso: 15 puntos)
    // Más experiencia = mejor para casos complejos
    const experienceScore = Math.min((lawyer.experience / 20) * 15, 15);
    score += experienceScore;
    
    if (lawyer.experience >= 15) {
      matchReasons.push("Amplia experiencia profesional");
    } else if (lawyer.experience >= 10) {
      matchReasons.push("Experiencia consolidada");
    }

    // 5. Calificación (peso: 10 puntos)
    const ratingScore = (lawyer.rating / 5) * 10;
    score += ratingScore;
    
    if (lawyer.rating >= 4.8) {
      matchReasons.push("Excelentes calificaciones");
    }

    // 6. Análisis de keywords en la descripción (peso extra)
    const descriptionLower = caseData.caseDescription.toLowerCase();
    const lawyerDescLower = lawyer.description.toLowerCase();
    
    // Keywords relacionadas con diferentes especialidades
    const keywords: { [key: string]: string[] } = {
      civil: ["demanda", "contrato", "indemnización", "daños"],
      penal: ["denuncia", "delito", "acusación", "defensa penal"],
      laboral: ["despido", "trabajo", "empleado", "empresa", "sueldo"],
      familiar: ["divorcio", "custodia", "herencia", "matrimonio", "hijo"],
      mercantil: ["empresa", "sociedad", "comercio", "negocio"],
      fiscal: ["impuesto", "hacienda", "declaración", "fiscal"],
      inmobiliario: ["propiedad", "vivienda", "alquiler", "compraventa"],
      administrativo: ["administración", "licencia", "permiso", "gobierno"],
    };

    // Buscar keywords relevantes
    const caseTypeKeywords = keywords[caseData.caseType] || [];
    let keywordMatches = 0;
    
    caseTypeKeywords.forEach((keyword) => {
      if (descriptionLower.includes(keyword) || lawyerDescLower.includes(keyword)) {
        keywordMatches++;
      }
    });
    
    if (keywordMatches > 0) {
      score += keywordMatches * 2; // 2 puntos por keyword
    }

    // 7. Cuantía del caso - abogados más experimentados para casos de alta cuantía
    if (caseData.hasAmount && caseData.amountInvolved) {
      const amount = parseFloat(caseData.amountInvolved);
      if (amount > 100000 && lawyer.experience >= 12) {
        score += 5;
        matchReasons.push("Experiencia en casos de alta cuantía");
      }
    }

    // 8. Análisis de complejidad del caso (longitud de descripción)
    if (caseData.caseDescription.length > 300) {
      // Caso complejo, preferir abogados experimentados
      if (lawyer.experience >= 12) {
        score += 5;
      }
    }

    // Normalizar el score a un rango de 0-100
    score = Math.min(Math.max(score, 0), 100);

    return {
      lawyer,
      score: Math.round(score),
      matchReasons,
    };
  });

  // Ordenar por score descendente
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Genera un resumen de recomendación personalizado
 */
export function generateMatchSummary(
  caseData: CaseFormData,
  topMatches: LawyerMatch[]
): string {
  const caseTypeName =
    caseData.caseType.charAt(0).toUpperCase() + caseData.caseType.slice(1);
  const urgencyText =
    caseData.urgency === "immediate" || caseData.urgency === "high"
      ? "urgente"
      : "normal";

  return `Basándonos en tu caso de ${caseTypeName} con prioridad ${urgencyText}, hemos encontrado ${topMatches.length} abogados especializados que se ajustan a tus necesidades. Los mejores matches están ordenados por compatibilidad con tu caso.`;
}
