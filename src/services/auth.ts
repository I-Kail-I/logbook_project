import api, { API_HEADERS } from "./api";
import { LoginResponse } from "./types";
import storage from "./storage";

interface LoginParams {
  username: string;
  password: string;
}

export const auth = {
  async login({ username, password }: LoginParams): Promise<LoginResponse> {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post<LoginResponse>("/api-loginsss", formData, {
        headers: {
          ...API_HEADERS,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success && response.data.data) {
        await storage.saveNip(response.data.data.nip);
        if (response.data.data.nama) {
          await storage.saveUserName(response.data.data.nama);
        }
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed",
      };
    }
  },

  async logout(): Promise<void> {
    await storage.clearAll();
  },

  async getCurrentUser(): Promise<{ nip: string; name: string | null } | null> {
    const nip = await storage.getNip();
    const name = await storage.getUserName();
    if (nip) {
      return { nip, name };
    }
    return null;
  },

  async isAuthenticated(): Promise<boolean> {
    return storage.isLoggedIn();
  },
};

export default auth;