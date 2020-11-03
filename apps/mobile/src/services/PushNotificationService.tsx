import ApiService from "./ApiService";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const PushNotificationService = {
  async updateToken(
    userToken: string,
    pushNotificationToken: string
  ): Promise<any> {
    try {
      const route: string =
        api + "pushNotificationTokens/" + pushNotificationToken;
      return await ApiService(route, userToken, "POST");
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default PushNotificationService;
