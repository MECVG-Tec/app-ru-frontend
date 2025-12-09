import { CreatePurchaseRequest, PaymentMethod, PurchaseResponse } from "@/lib/types";
import { parseCookies, destroyCookie } from "nookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchClient(path: string, options: RequestInit = {}) {
  const cookies = parseCookies();
  let token: string | undefined = cookies["ru-facil-token"];

  if (token && (token.startsWith("<") || token.includes("<!DOCTYPE"))) {
    destroyCookie(null, "ru-facil-token");
    destroyCookie(null, "ru-facil-email");
    token = undefined;
  }

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const errorText = await response.text();
      if (errorText.startsWith("<")) {
        console.error("HTML de Erro:", errorText);
        throw new Error("Erro de autenticação ou servidor.");
      }
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Erro na requisição");
    } catch (e: any) {
      throw new Error(e.message || `Erro HTTP: ${response.status}`);
    }
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  login: (body: { email: string; senha: string }) =>
    fetchClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: any) =>
    fetchClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getHistory: (email: string) =>
    fetchClient(`/api/v1/fichas/compras?email=${email}`),

  getMenu: (date: string, mealType: "ALMOCO" | "JANTAR") =>
    fetchClient(`/api/v1/cardapios?data=${date}&tipoRefeicao=${mealType}`),

  createPurchase: (data: CreatePurchaseRequest): Promise<PurchaseResponse> => 
    fetchClient('/api/v1/fichas/compras', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),

  forgotPassword: (email: string) =>
    fetchClient(`/auth/esqueci-senha?email=${encodeURIComponent(email)}`, {
      method: "POST",
    }),

  resetPassword: (token: string, novaSenha: string) =>
    fetchClient(
      `/auth/redefinir-senha?token=${encodeURIComponent(
        token
      )}&novaSenha=${encodeURIComponent(novaSenha)}`,
      { method: "POST" }
    ),
};
