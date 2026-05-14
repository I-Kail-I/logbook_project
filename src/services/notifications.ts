import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@notification_history";

export interface NotificationItem {
  id: string;
  type: "logbook_saved" | "logbook_added" | "reminder";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  createdAt: number;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const logbookMessages = [
  "Catatan aktivitas harian telah berhasil disimpan",
  "Logbook berhasil ditambahkan ke daftar aktivitas",
  "Aktivitas harian telah tercatat dengan sukses",
  "Data logbook Anda telah diperbarui",
];

const logbookTitles = [
  "Logbook Tersimpan",
  "Aktivitas Tercatat",
  "Logbook Berhasil",
  "Data Tersimpan",
];

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export const notificationService = {
  async scheduleLogbookSaved(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Logbook Tersimpan",
        body: "Catatan aktivitas harian telah berhasil disimpan",
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
    });

    await this.addToHistory({
      type: "logbook_saved",
      title: randomItem(logbookTitles),
      message: randomItem(logbookMessages),
    });
  },

  async scheduleLogbookAdded(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Aktivitas Baru",
        body: "Aktivitas baru telah ditambahkan ke logbook Anda",
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
    });

    await this.addToHistory({
      type: "logbook_added",
      title: "Aktivitas Baru",
      message: "Aktivitas baru telah ditambahkan ke logbook Anda",
    });
  },

  async addToHistory(item: Omit<NotificationItem, "id" | "time" | "unread" | "createdAt">): Promise<void> {
    const history = await this.getHistory();
    const newItem: NotificationItem = {
      ...item,
      id: Date.now().toString(),
      time: "baru saja",
      unread: true,
      createdAt: Date.now(),
    };
    history.unshift(newItem);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  async getHistory(): Promise<NotificationItem[]> {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    const items: NotificationItem[] = JSON.parse(data);
    return items.map((item) => {
      const elapsed = Date.now() - item.createdAt;
      const minutes = Math.floor(elapsed / 60000);
      const hours = Math.floor(elapsed / 3600000);
      const days = Math.floor(elapsed / 86400000);
      let time: string;
      if (minutes < 1) time = "baru saja";
      else if (minutes < 60) time = `${minutes} menit lalu`;
      else if (hours < 24) time = `${hours} jam lalu`;
      else time = `${days} hari lalu`;
      return { ...item, time };
    });
  },

  async markAllRead(): Promise<void> {
    const history = await this.getHistory();
    const updated = history.map((item) => ({ ...item, unread: false }));
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  async deleteNotification(id: string): Promise<void> {
    const history = await this.getHistory();
    const updated = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  async getUnreadCount(): Promise<number> {
    const history = await this.getHistory();
    return history.filter((item) => item.unread).length;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },
};

export default notificationService;
