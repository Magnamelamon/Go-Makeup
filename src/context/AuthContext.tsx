import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAllUsers, saveUser, getUserByEmail, type User } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (nombre: string, email: string, password: string) => boolean;
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

  const login = (email: string, password: string): boolean => {
    const usersDB = getAllUsers();
    const foundUser = usersDB.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('gomakeup_session', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (nombre: string, email: string, password: string): boolean => {
    if (getUserByEmail(email)) return false; // Email already taken
    
    const newUser: User = {
      id: 0, // id assigned in saveUser
      nombre,
      email,
      password,
      rol: 'usuario',
      estado: 'activo',
      fechaRegistro: '' // Auto-assigned in saveUser
    };
    
    saveUser(newUser);
    // Auto login
    return login(email, password);
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
