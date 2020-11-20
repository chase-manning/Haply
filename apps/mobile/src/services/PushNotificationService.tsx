import ApiService from "./ApiService";

const PushNotificationService = {
  async updateToken(
    userToken: string,
    pushNotificationToken: string
  ): Promise<any> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisPushNotificationTokensCreateV1/" +
        pushNotificationToken;
      return await ApiService(route, userToken, "POST");
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default PushNotificationService;
