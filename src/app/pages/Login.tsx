import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast.success("¡Bienvenido de vuelta!");
        navigate("/");
      } else {
        toast.error(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      toast.error("Error de red. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
          <Scale className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-3xl font-bold tracking-tighter">Lexi</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-indigo-500 to-primary" />
        <CardHeader className="space-y-1 pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-center">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@correo.com" 
                  className="pl-9 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="#" className="text-xs text-primary hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-9 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl mt-6" size="lg" disabled={isLoading}>
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link to="/register" className="text-primary font-bold hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
