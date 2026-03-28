import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { saveUser, type User } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  updateCurrentUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Sync session with local storage to persist login
  useEffect(() => {
    const session = localStorage.getItem('gomakeup_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        const userData: User = {
          id: data._id,
          nombre: data.nombre,
          email: data.email,
          rol: 'admin',
          estado: 'activo',
          fechaRegistro: new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('gomakeup_session', JSON.stringify({ ...userData, token: data.token }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const register = async (_nombre: string, _email: string, _password: string): Promise<boolean> => {
    // Para simplificar ahora mismo, los admins solo pueden ser creados por seeder directamente 
    // en la BD, no dejaremos registro público de admins por seguridad.
    console.warn("Registro público deshabilitado temporalmente de acuerdo al plan de Exclusividad Admin.");
    return false;
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('gomakeup_session', JSON.stringify(updatedUser));
    saveUser(updatedUser); // Also save to DB
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gomakeup_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateCurrentUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
