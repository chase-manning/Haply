import { SettingsState } from "../state/settingsSlice";
import ApiService from "./ApiService";

const SettingService = {
  async createSetting(setting: SettingsState): Promise<any> {
    return await ApiService(
      "apisSettingsCreateV1",
      "POST",
      JSON.stringify(setting)
    );
  },
  async getSetting(): Promise<SettingsState | null> {
    const settingResponse: any = await ApiService("apisSettingsGetV1", "GET");
    let nextSeconds = settingResponse.nextNotification._seconds;
    let nextDate = new Date(nextSeconds * 1000);
    settingResponse.nextNotification = nextDate.toString();
    const setting: SettingsState = settingResponse;
    return setting;
  },
};

export default SettingService;
