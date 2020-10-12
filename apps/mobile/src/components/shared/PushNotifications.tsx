import { Plugins, PushNotificationToken } from "@capacitor/core";
import { useDispatch } from "react-redux";
import { setPushNotificationToken } from "../../state/userSlice";

const { PushNotifs } = Plugins;

const PushNotifications = () => {
  const dispatch = useDispatch();
  console.log("woof");

  PushNotifs.requestPermission().then((result: any) => {
    if (result.granted) PushNotifs.register();
  });

  PushNotifs.addListener("registration", (token: PushNotificationToken) => {
    dispatch(setPushNotificationToken(token.value));
  });

  return null;
};

export default PushNotifications;
