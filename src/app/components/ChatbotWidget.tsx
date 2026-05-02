import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ChatbotWidgetProps {
  chatbotUrl?: string;
}

export function ChatbotWidget({ chatbotUrl }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante del chatbot */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Ventana del chatbot */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 overflow-hidden">
          {chatbotUrl ? (
            <iframe
              src={chatbotUrl}
              className="w-full h-full border-0"
              title="Chatbot de asistencia legal"
            />
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-16 h-16 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Asistente Virtual</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestro chatbot te ayudará a encontrar el abogado perfecto para tu caso.
              </p>
              <p className="text-xs text-muted-foreground">
                Chatbot no configurado. Por favor, proporciona la URL del chatbot.
              </p>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
