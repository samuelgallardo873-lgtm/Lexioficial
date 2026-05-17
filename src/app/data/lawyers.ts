export type ConsultationType =
  | "oral-presencial"
  | "escrita-presencial"
  | "oral-videollamada"
  | "escrita-videollamada";

export interface Lawyer {
  id: string;
  name: string;
  email?: string;
  matricula?: string;
  status?: string;
  specialty: string[];
  rating: number;
  reviewsCount: number;
  reviews: {
    name: string;
    rating: number;
    comment: string;
    date: string | Date;
  }[];
  experience: number;
  consultationType: ConsultationType[];
  price: {
    "oral-presencial"?: number;
    "escrita-presencial"?: number;
    "oral-videollamada"?: number;
    "escrita-videollamada"?: number;
  };
  availability: string;
  image: string;
  description: string;
  languages: string[];
}

export const lawyers: Lawyer[] = [
  {
    id: "1",
    name: "Dra. María González",
    specialty: ["civil", "familiar"],
    rating: 4.9,
    reviews: 127,
    experience: 15,
    consultationType: ["oral-presencial", "escrita-presencial", "oral-videollamada", "escrita-videollamada"],
    price: {
      "oral-presencial": 80,
      "escrita-presencial": 50,
      "oral-videollamada": 70,
      "escrita-videollamada": 45,
    },
    availability: "Disponible hoy",
    image: "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhd3llciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Especialista en derecho civil y familiar con amplia experiencia en casos de divorcio, custodia y herencias.",
    languages: ["Español", "Inglés"],
  },
  {
    id: "2",
    name: "Dr. Carlos Ramírez",
    specialty: ["penal", "laboral"],
    rating: 4.8,
    reviews: 95,
    experience: 12,
    consultationType: ["oral-presencial", "oral-videollamada"],
    price: {
      "oral-presencial": 100,
      "oral-videollamada": 90,
    },
    availability: "Disponible mañana",
    image: "https://images.unsplash.com/photo-1579540830482-659e7518c895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhdHRvcm5leSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Abogado penalista con especialización en defensa penal y derecho laboral. Reconocido por su tasa de éxito.",
    languages: ["Español"],
  },
  {
    id: "3",
    name: "Dra. Ana Martínez",
    specialty: ["mercantil", "fiscal"],
    rating: 5.0,
    reviews: 143,
    experience: 18,
    consultationType: ["oral-videollamada", "escrita-videollamada"],
    price: {
      "oral-videollamada": 120,
      "escrita-videollamada": 70,
    },
    availability: "Disponible hoy",
    image: "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhd3llciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Experta en derecho mercantil y fiscal, asesorando empresas y emprendedores en constitución y cumplimiento fiscal.",
    languages: ["Español", "Inglés", "Francés"],
  },
  {
    id: "4",
    name: "Dr. Luis Hernández",
    specialty: ["inmobiliario", "civil"],
    rating: 4.7,
    reviews: 89,
    experience: 10,
    consultationType: ["oral-presencial", "escrita-presencial"],
    price: {
      "oral-presencial": 90,
      "escrita-presencial": 55,
    },
    availability: "Disponible en 2 días",
    image: "https://images.unsplash.com/photo-1579540830482-659e7518c895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhdHRvcm5leSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Especialista en derecho inmobiliario, compraventa, arrendamientos y resolución de conflictos de propiedad.",
    languages: ["Español"],
  },
  {
    id: "5",
    name: "Dra. Patricia Ruiz",
    specialty: ["laboral", "familiar"],
    rating: 4.9,
    reviews: 156,
    experience: 14,
    consultationType: ["oral-presencial", "escrita-videollamada", "oral-videollamada"],
    price: {
      "oral-presencial": 85,
      "escrita-videollamada": 50,
      "oral-videollamada": 75,
    },
    availability: "Disponible hoy",
    image: "https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhd3llciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Abogada especializada en derecho laboral y familiar, con enfoque en derechos de trabajadores y familia.",
    languages: ["Español", "Portugués"],
  },
  {
    id: "6",
    name: "Dr. Roberto Sánchez",
    specialty: ["penal", "administrativo"],
    rating: 4.6,
    reviews: 72,
    experience: 8,
    consultationType: ["escrita-presencial", "escrita-videollamada"],
    price: {
      "escrita-presencial": 75,
      "escrita-videollamada": 45,
    },
    availability: "Disponible mañana",
    image: "https://images.unsplash.com/photo-1579540830482-659e7518c895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhdHRvcm5leSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3NTM5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Abogado penalista y administrativista, defensor de derechos civiles y asesor en trámites gubernamentales.",
    languages: ["Español", "Inglés"],
  },
];

export const specialties = [
  { id: "civil", name: "Civil", icon: "Scale" },
  { id: "penal", name: "Penal", icon: "Gavel" },
  { id: "laboral", name: "Laboral", icon: "Briefcase" },
  { id: "familiar", name: "Familiar", icon: "Users" },
  { id: "mercantil", name: "Mercantil", icon: "Building2" },
  { id: "fiscal", name: "Fiscal", icon: "Receipt" },
  { id: "inmobiliario", name: "Inmobiliario", icon: "Home" },
  { id: "administrativo", name: "Administrativo", icon: "FileText" },
];
