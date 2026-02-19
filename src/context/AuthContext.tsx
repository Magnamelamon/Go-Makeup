import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const usersDB: (User & { password: string })[] = [
  { id: 1, nombre: 'Admin', email: 'admin@gomakeup.com', rol: 'admin', password: 'admin123' },
  { id: 2, nombre: 'Usuario', email: 'usuario@gomakeup.com', rol: 'usuario', password: 'user123' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = usersDB.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
