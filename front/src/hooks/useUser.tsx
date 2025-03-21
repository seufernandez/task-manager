import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../utils/axios';
import toast from 'react-hot-toast';

interface UserContextValue {
  username: string;
  isAuthenticated: boolean;
  getUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const getUser = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get(`users/me`);
      if (response.data && response.data.username) {
        setUsername(response.data.username);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await getUser();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response?.status === 401) {
        toast.error('Username or password invalid');
      } else {
        toast.error('Error on authentication');
      }
      return Promise.reject(error);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common['Authorization'];
    setUsername('');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ username, isAuthenticated, getUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};