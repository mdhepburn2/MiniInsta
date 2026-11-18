import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '@/constants/api';

// Change this to your Django server address
const API_URL = url;

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState<any>(null);
  const [profileId, setProfileId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { // restore session on launch
    (async () => {
      setToken(await AsyncStorage.getItem('auth_token'));
      setProfileId(await AsyncStorage.getItem('profile_id'));
      setIsLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    // POST /api/login/, then save token + profile.id
    // to state AND AsyncStorage
    try {
      const res = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      const newProfileId = String(data.profile.pk);

      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('profile_id', newProfileId);
      setToken(data.token);
      setProfileId(newProfileId);
    } catch (e) {
      console.error('Login request failed:', e);
      throw e; // rethrow so the login screen can show its error message
    }
  };

  const logout = async () => {
    // clear state AND AsyncStorage
    await AsyncStorage.multiRemove(['auth_token', 'profile_id']);
    setToken(null);
    setProfileId(null);
  };

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Token ${token}`,
      },
    });
    if (res.status === 401) await logout(); // stale token
    return res;
  };

  return (
    <AuthContext.Provider
      value={{ token, profileId, isLoading, login, logout, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}