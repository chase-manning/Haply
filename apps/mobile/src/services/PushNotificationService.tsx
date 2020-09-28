import { User } from "firebase";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const PushNotificationService = {
  async updateToken(user: User, pushNotificationToken: string): Promise<any> {
    try {
      const route: string =
        api + "pushNotificationTokens/" + pushNotificationToken;
      return user
        .getIdToken()
        .then(async (idToken) => {
          const requestOptions = {
            method: "POST",
            headers: {
              Authorization: "Bearer " + idToken,
              "Content-Type": "application/json",
            },
          };

          return await fetch(route, requestOptions);
        })
        .catch(function(error) {
          console.log(error);
          return null;
        });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default PushNotificationService;
