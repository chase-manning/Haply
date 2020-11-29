import ApiService from "./ApiService";

const PushNotificationService = {
  async updateToken(pushNotificationToken: string): Promise<any> {
    try {
      return await ApiService(
        "apisPushNotificationTokensCreateV1/" + pushNotificationToken,
        "POST"
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default PushNotificationService;
