import { SettingsState } from "../state/settingsSlice";
import ApiService from "./ApiService";

export const createSetting = async (setting: SettingsState): Promise<any> => {
  return await ApiService(
    "apisSettingsCreateV1",
    "POST",
    JSON.stringify(setting)
  );
};
export const getSetting = async (): Promise<SettingsState | null> => {
  const settingResponse: any = await ApiService("apisSettingsGetV1", "GET");
  let nextSeconds = settingResponse.nextNotification._seconds;
  let nextDate = new Date(nextSeconds * 1000);
  settingResponse.nextNotification = nextDate.toString();
  const setting: SettingsState = settingResponse;
  return setting;
};
