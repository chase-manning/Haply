import { Plugins, PushNotificationToken } from "@capacitor/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPushNotificationToken } from "../../state/userSlice";

const { PushNotifs } = Plugins;

const PushNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    PushNotifs.addListener("registration", (token: PushNotificationToken) => {
      dispatch(setPushNotificationToken(token.value));
    });

    PushNotifs.requestPermission().then((result: any) => {
      if (result.granted) PushNotifs.register();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default PushNotifications;
