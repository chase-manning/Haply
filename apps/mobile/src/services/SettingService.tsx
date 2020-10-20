import { SettingsState } from "../state/settingsSlice";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const SettingService = {
  async createSetting(userToken: string, setting: SettingsState): Promise<any> {
    try {
      const route: string = api + "v2/settings";

      const requestOptions = {
        method: "POST",
        body: JSON.stringify(setting),
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        },
      };

      return await fetch(route, requestOptions);
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getSetting(userToken: string): Promise<SettingsState | null> {
    try {
      const route: string = api + "settings";

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(route, requestOptions);
      const settingResponse: any = await response.json();
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
