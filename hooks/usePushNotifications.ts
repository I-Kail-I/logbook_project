import { useSettings } from "@/contexts/SettingsContext";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }) as Notifications.NotificationBehavior,
});

export function usePushNotifications() {
  const { settings, setPushToken, t } = useSettings();
  const hasScheduled = useRef(false);

  // Register for push token and request permissions
  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    async function register() {
      if (!Device.isDevice) {
        console.log("Push notifications require a physical device");
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      const token = tokenData.data;
      await setPushToken(token);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#F5A623",
        });
      }
    }

    register();
  }, [settings.notificationsEnabled, setPushToken]);

  // Schedule / cancel local daily reminder
  useEffect(() => {
    async function manageLocalNotifications() {
      if (settings.notificationsEnabled && !hasScheduled.current) {
        // Cancel existing to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: t("daily_reminder_title"),
            body: t("daily_reminder_body"),
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 9,
            minute: 0,
          } as any,
        });

        hasScheduled.current = true;
      } else if (!settings.notificationsEnabled && hasScheduled.current) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        hasScheduled.current = false;
      }
    }

    manageLocalNotifications();
  }, [settings.notificationsEnabled, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    };
  }, []);
}
