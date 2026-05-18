import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "@notification_history";

let Notifications: typeof import("expo-notifications") | null = null;

async function loadNotifications() {
  if (!Notifications) {
    try {
      Notifications = await import("expo-notifications");
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      console.log("expo-notifications not available in this environment");
    }
  }
  return Notifications;
}

export interface NotificationItem {
  id: string;
  type: "logbook_saved" | "logbook_added" | "logbook_deleted" | "reminder";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  createdAt: number;
}

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
    await this.scheduleNotification("Logbook Tersimpan", "Catatan aktivitas harian telah berhasil disimpan", {
      type: "logbook_saved",
      title: randomItem(logbookTitles),
      message: randomItem(logbookMessages),
    });
  },

  async scheduleLogbookAdded(): Promise<void> {
    await this.scheduleNotification("Aktivitas Baru", "Aktivitas baru telah ditambahkan ke logbook Anda", {
      type: "logbook_added",
      title: "Aktivitas Baru",
      message: "Aktivitas baru telah ditambahkan ke logbook Anda",
    });
  },

  async scheduleLogbookDeleted(): Promise<void> {
    await this.scheduleNotification("Logbook Dihapus", "Logbook berhasil dihapus", {
      type: "logbook_deleted",
      title: "Logbook Dihapus",
      message: "Logbook berhasil dihapus",
    });
  },

  async scheduleNotification(title: string, body: string, historyItem: Omit<NotificationItem, "id" | "time" | "unread" | "createdAt">): Promise<void> {
    const mod = await loadNotifications();
    if (mod) {
      try {
        await mod.scheduleNotificationAsync({
          content: { title, body, sound: true },
          trigger: { type: mod.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 },
        });
      } catch (e) {
        console.log("Failed to schedule notification:", e);
      }
    }
    await this.addToHistory(historyItem);
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
