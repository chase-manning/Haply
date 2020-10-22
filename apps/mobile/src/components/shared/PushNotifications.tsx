import { Plugins, PushNotificationToken, Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPushNotificationToken } from "../../state/userSlice";

const isPushNotificationsAvailable = Capacitor.isPluginAvailable(
  "PushNotifications"
);

const PushNotificationSetup = () => {
  const dispatch = useDispatch();
  const { PushNotifications } = Plugins;

  useEffect(() => {
    if (!isPushNotificationsAvailable) return;

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        dispatch(setPushNotificationToken(token.value));
      }
    );

    PushNotifications.requestPermission().then((result: any) => {
      if (result.granted) PushNotifications.register();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default PushNotificationSetup;
