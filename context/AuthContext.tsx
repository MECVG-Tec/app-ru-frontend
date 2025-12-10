"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { api } from "@/services/api";
import { RegisterRequest } from "@/lib/types";

type User = {
  email: string;
  name?: string;
  is_student?: boolean;
  accessibilityOptions?: {
    highContrast: boolean;
    largeText: boolean;
  };
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  updateUserPreferences: (prefs: { highContrast: boolean; largeText: boolean }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const {
      "ru-facil-token": token,
      "ru-facil-email": savedEmail,
      "ru-facil-cliente": savedCliente,
    } = parseCookies();

    console.log("savedCliente: ", savedCliente);
    
    if (token && savedEmail && savedCliente) {
      setUser({
        email: savedEmail,
        name: JSON.parse(savedCliente).nome || savedEmail.split("@")[0],
        is_student: JSON.parse(savedCliente).ehAluno,
        accessibilityOptions: {
          highContrast: JSON.parse(savedCliente).prefereAltoContraste,
          largeText: JSON.parse(savedCliente).prefereFonteGrande,
        },
      });
    }
    setLoading(false);
  }, []);

  const updateUserPreferences = (prefs: { highContrast: boolean; largeText: boolean }) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      accessibilityOptions: {
        highContrast: prefs.highContrast,
        largeText: prefs.largeText
      }
    };
    setUser(updatedUser);

    const { "ru-facil-cliente": savedCliente } = parseCookies();
    if (savedCliente) {
      const clienteObj = JSON.parse(savedCliente);
      clienteObj.prefereAltoContraste = prefs.highContrast;
      clienteObj.prefereFonteGrande = prefs.largeText;
      
      setCookie(null, "ru-facil-cliente", JSON.stringify(clienteObj), {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }
  };

  async function login(email: string, password: string) {
    try {
      const response = await api.login({ email, senha: password });

      const token = response.token || response;

      setCookie(null, "ru-facil-token", token, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      setCookie(null, "ru-facil-cliente", JSON.stringify(response.cliente), {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      setCookie(null, "ru-facil-email", email, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      setUser({ email, name: email.split("@")[0] });
      router.push("/home");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  async function register(data: RegisterRequest) {
    try {
      await api.register(data);
      await login(data.email, data.senha);
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  }

  function logout() {
    destroyCookie(null, "ru-facil-token");
    destroyCookie(null, "ru-facil-email");
    destroyCookie(null, "ru-facil-cliente");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        updateUserPreferences,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
