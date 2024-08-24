import React, { createContext, useState, ReactNode, FC } from 'react';

// Define the shape of the user data
export interface User {
  id: number;
  first_name: string;
  email: string;
  phone_number: string;
}

// Define the shape of the context
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // Optionally store user data in localStorage or sessionStorage
  };

  const logout = () => {
    setUser(null);
    // Clear user data from storage if needed
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
