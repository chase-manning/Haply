import { SettingsState } from "../state/settingsSlice";
import ApiService from "./ApiService";

const SettingService = {
  async createSetting(userToken: string, setting: SettingsState): Promise<any> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisSettingsCreateV1";
      return await ApiService(
        route,
        userToken,
        "POST",
        JSON.stringify(setting)
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getSetting(userToken: string): Promise<SettingsState | null> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisSettingsGetV1";
      const response = await ApiService(route, userToken, "GET");
      const settingResponse: any = await response!.json();
      let nextSeconds = settingResponse.nextNotification._seconds;
      let nextDate = new Date(nextSeconds * 1000);
      settingResponse.nextNotification = nextDate.toString();
      const setting: SettingsState = settingResponse;
      return setting;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default SettingService;
