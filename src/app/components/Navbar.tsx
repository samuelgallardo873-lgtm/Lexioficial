import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Sun, Moon, LogOut, User as UserIcon, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
            <Scale className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Lexi</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            Cómo funciona
          </Link>
          {/* Note: anchors (#beneficios) only work well on Home page, 
              but left them as is. Ideally they would check location.pathname. */}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button asChild className="rounded-full shadow-lg shadow-primary/20 hidden md:inline-flex">
            <Link to="/find-lawyer">Buscar abogado</Link>
          </Button>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-primary/10 border-primary/20">
                  <UserIcon className="w-5 h-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-primary" />
                        Panel Administrativo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden md:inline-flex rounded-full">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full hidden lg:inline-flex">
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
