import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isLawyer?: boolean;
  lawyerId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void> | void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem('lexi_auth_token');
    
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        let userData = await response.json();
        
        // Also check if the user is a lawyer
        try {
          const lawyerResponse = await fetch(`${apiUrl}/api/lawyers/me`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          if (lawyerResponse.ok) {
            const lawyerData = await lawyerResponse.json();
            userData = {
              ...userData,
              isLawyer: true,
              lawyerId: lawyerData._id
            };
          } else {
            userData = {
              ...userData,
              isLawyer: false
            };
          }
        } catch (lawyerErr) {
          console.error('Error fetching lawyer status:', lawyerErr);
          userData = { ...userData, isLawyer: false };
        }

        setUser(userData);
      } else {
        // Token might be invalid or expired
        localStorage.removeItem('lexi_auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newToken: string, userData: User) => {
    localStorage.setItem('lexi_auth_token', newToken);
    setToken(newToken);
    setUser(userData);
    // Fetch full user profile to determine if they are a lawyer
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('lexi_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
