import { User } from "firebase";
import { SettingsState } from "../state/settingsSlice";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const SettingService = {
  async createSetting(user: User, setting: SettingsState): Promise<any> {
    try {
      const route: string = api + "settings";
      return user
        .getIdToken()
        .then(async (idToken) => {
          const requestOptions = {
            method: "POST",
            body: JSON.stringify(setting),
            headers: {
              Authorization: "Bearer " + idToken,
              "Content-Type": "application/json",
            },
          };

          return await fetch(route, requestOptions);
        })
        .catch(function (error) {
          console.log(error);
          return null;
        });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default SettingService;
