export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  password?: string;
}

const STORAGE_KEY = 'gomakeup_users';

const initialUsersData: User[] = [];

export const initializeUsersDB = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsersData));
  }
};

export const getAllUsers = (): User[] => {
  initializeUsersDB();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialUsersData;
};

export const getUserById = (id: number): User | undefined => {
  const users = getAllUsers();
  return users.find((u: User) => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find((u: User) => u.email === email);
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  
  if (index >= 0) {
    // Maintain password if editing and no new password provided
    if (!user.password && users[index].password) {
      user.password = users[index].password;
    }
    users[index] = user; // Update existing
  } else {
    // Auto-increment ID for new user
    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    user.id = maxId + 1;
    
    if (!user.fechaRegistro) {
      const today = new Date();
      user.fechaRegistro = `${today.getDate()}/${today.toLocaleString('es', { month: 'short' })}/${today.getFullYear()}`;
    }
    users.push(user); // Add new
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const deleteUser = (id: number): void => {
  const users = getAllUsers();
  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
