import api, { API_HEADERS } from "./api";
import { LoginResponse } from "./types";
import storage from "./storage";
import notificationService from "./notifications";

interface LoginParams {
  username: string;
  password: string;
}

const TEST_ACCOUNTS = [
  { username: "1234567890", password: "password123", nip: "1234567890", name: "Test Employee" },
  { username: "admin", password: "admin", nip: "admin", name: "Admin User" },
  { username: "demo", password: "demo", nip: "demo", name: "Demo User" },
];

export const auth = {
  async login({ username, password }: LoginParams): Promise<LoginResponse> {
    // Check for test accounts first
    const testAccount = TEST_ACCOUNTS.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (testAccount) {
      await storage.saveNip(testAccount.nip);
      await storage.saveUserName(testAccount.name);
      return {
        success: true,
        data: { nip: testAccount.nip, nama: testAccount.name },
      };
    }

    // Try API login
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
    await notificationService.clearAll();
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