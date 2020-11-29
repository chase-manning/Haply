import ApiService from "./ApiService";

const PushNotificationService = {
  async updateToken(pushNotificationToken: string): Promise<any> {
    return await ApiService(
      "apisPushNotificationTokensCreateV1/" + pushNotificationToken,
      "POST"
    );
  },
};

export default PushNotificationService;
