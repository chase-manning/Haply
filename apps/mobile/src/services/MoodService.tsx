import { User } from "firebase";
import Mood from "../models/mood";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const MoodService = {
  async createMood(user: User, mood: Mood): Promise<any> {
    try {
      const route: string = api + "v2/moods";
      return user
        .getIdToken()
        .then(async (idToken) => {
          const requestOptions = {
            method: "POST",
            body: mood.string,
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

  async getMoods(user: User, order?: string, limit?: number): Promise<any> {
    try {
      const route: string = api + "moods";
      return user
        .getIdToken()
        .then(async (idToken: string) => {
          const requestOptions = {
            headers: {
              Authorization: "Bearer " + idToken,
            },
          };

          let fullRoute: string = route;
          if (!!order || !!limit) fullRoute += "?";
          if (!!order) fullRoute += "order=" + order;
          if (!!order && !!limit) fullRoute += "&";
          if (!!limit) fullRoute += "limit=" + limit;

          return await fetch(fullRoute, requestOptions);
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

  async deleteMood(user: User, moodId: string): Promise<any> {
    try {
      const route: string = api + "moods";
      return user
        .getIdToken()
        .then(async (idToken) => {
          const requestOptions = {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + idToken,
            },
          };

          return await fetch(route + "/" + moodId, requestOptions);
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

export default MoodService;
