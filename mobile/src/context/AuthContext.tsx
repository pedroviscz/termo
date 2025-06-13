import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getUserByLogin, registerDeviceId } from '../services/user'; // nova função

export interface AuthContextData {
  deviceId: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const createDeviceId = async (): Promise<string> => {
    const devId = uuidv4();
    await SecureStore.setItemAsync('deviceId', devId);
    
    return devId;
  };

  useEffect(() => {
    const searchDeviceId = async () => {
      await SecureStore.deleteItemAsync('deviceId')
      try {
        const devId = await SecureStore.getItemAsync('deviceId');
        if (devId) setDeviceId(devId);
      } catch (e) {
        console.log('Erro ao buscar deviceId no SecureStore');
      } finally {
        setLoading(false);
      }
    };
    searchDeviceId();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await getUserByLogin({ username, password });

      if (response.status!==200) return false;

      const devId = await createDeviceId();
      await registerDeviceId(username, devId);

      setDeviceId(devId);

      return true;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 400 || status === 401) {
          console.warn('Login inválido:', message); // mensagem esperada, como "Usuário não encontrado"
        } else {
          console.error('Erro no login:', message || 'Erro desconhecido');
        }
      } else {
        console.error('Erro inesperado no login:', error.message);
      }
      return false;
    }
  };


  const logout = async () => {
    await SecureStore.deleteItemAsync('deviceId'); // corrigido
    setDeviceId(null);
  };

  return (
    <AuthContext.Provider value={{ deviceId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};