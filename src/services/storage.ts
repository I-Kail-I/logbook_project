import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./types";

const STORAGE_KEYS = {
  USER_NIP: "@user_nip",
  USER_DATA: "@user_data",
  USER_NAME: "@user_name",
  PROFILE_EMAIL: "@profile_email",
  PROFILE_PHONE: "@profile_phone",
  PROFILE_PICTURE: "@profile_picture",
  SAVED_PASSWORD: "@saved_password",
};

export const storage = {
  async saveNip(nip: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NIP, nip);
  },

  async getNip(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_NIP);
  },

  async saveUserData(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUserData(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async saveUserName(name: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  async getUserName(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
  },

  async saveProfileEmail(email: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_EMAIL, email);
  },

  async getProfileEmail(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.PROFILE_EMAIL);
  },

  async saveProfilePhone(phone: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_PHONE, phone);
  },

  async getProfilePhone(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.PROFILE_PHONE);
  },

  async saveProfilePicture(uri: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_PICTURE, uri);
  },

  async getProfilePicture(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.PROFILE_PICTURE);
  },

  async savePassword(password: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PASSWORD, password);
  },

  async getSavedPassword(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.SAVED_PASSWORD);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_NIP,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.PROFILE_EMAIL,
      STORAGE_KEYS.PROFILE_PHONE,
      STORAGE_KEYS.PROFILE_PICTURE,
      STORAGE_KEYS.SAVED_PASSWORD,
    ]);
  },

  async isLoggedIn(): Promise<boolean> {
    const nip = await this.getNip();
    return !!nip;
  },
};

export default storage;