import { Star, Clock, MessageSquare, Video, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Lawyer } from "../data/lawyers";
import { Link } from "react-router-dom";

interface LawyerCardProps {
  lawyer: Lawyer;
  matchReasons?: string[];
}

export function LawyerCard({ lawyer, matchReasons }: LawyerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={lawyer.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300"}
            alt={lawyer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold mb-1">{lawyer.name}</h3>
              <p className="text-sm text-muted-foreground">
                {lawyer.experience} años de experiencia
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{lawyer.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({lawyer.reviewsCount})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {lawyer.specialty.map((spec) => (
              <Badge key={spec} variant="secondary" className="capitalize">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Razones de matching si están disponibles */}
          {matchReasons && matchReasons.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-2">
                ¿Por qué recomendamos este abogado?
              </p>
              <ul className="space-y-1">
                {matchReasons.slice(0, 3).map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{lawyer.availability}</span>
            </div>
          </div>

          <div className="flex gap-2 items-center text-sm mb-4">
            {lawyer.consultationType.some(t => t.includes("oral")) && (
              <div className="flex items-center gap-1">
                <span className="text-base">💬</span>
                <span>Oral</span>
              </div>
            )}
            {lawyer.consultationType.some(t => t.includes("escrita")) && (
              <div className="flex items-center gap-1">
                <span className="text-base">📝</span>
                <span>Escrita</span>
              </div>
            )}
            {lawyer.consultationType.some(t => t.includes("videollamada")) && (
              <div className="flex items-center gap-1">
                <span className="text-base">📹</span>
                <span>Virtual</span>
              </div>
            )}
            {lawyer.consultationType.some(t => t.includes("presencial")) && (
              <div className="flex items-center gap-1">
                <span className="text-base">👤</span>
                <span>Presencial</span>
              </div>
            )}
          </div>
          <div className="text-sm mb-4">
            <span className="text-muted-foreground">Desde </span>
            <span className="font-semibold text-primary">
              ${lawyer.price && Object.values(lawyer.price).filter(p => p !== undefined && p !== null).length > 0
                ? Math.min(...Object.values(lawyer.price).filter(p => p !== undefined && p !== null) as number[])
                : 0}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {lawyer.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link to={`/lawyer/${lawyer.id}`}>Ver perfil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}