import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useMemo, useState, useEffect, useRef } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [tokens, setTokens] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [responses, setResponses] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((tokens) => {
      if (!tokens) {
        return;
      }

      setTokens(tokens);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotifications((n) => [...n, notification]);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setResponses((r) => [...r, response]);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return useMemo(
    () => ({
      tokens,
      notifications,
      responses,
    }),
    [tokens, notifications, responses]
  );
}

async function registerForPushNotificationsAsync() {
  if (!Constants.isDevice) {
    return;
  }

  const status = await Notifications.getPermissionsAsync();
  if (status === "denied") {
    return;
  }

  if (status !== "granted") {
    const request = await Notifications.requestPermissionsAsync();
    if (request.status !== "granted") {
      return;
    }
  }

  const [expoToken, deviceToken] = await Promise.all([
    Notifications.getExpoPushTokenAsync(),
    Notifications.getDevicePushTokenAsync(),
  ]);

  return {
    expoToken: expoToken.data,
    deviceToken: deviceToken.data,
  };
}
