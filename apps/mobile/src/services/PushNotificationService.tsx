import ApiService from "./ApiService";

export const updateToken = async (token: string): Promise<any> => {
  return await ApiService(
    "apisPushNotificationTokensCreateV1/" + token,
    "POST"
  );
};
