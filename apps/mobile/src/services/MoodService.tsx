import Mood, { MoodResponse } from "../models/mood";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";
//const api: string = "http://localhost:5001/happiness-software/us-central1/webApi/api/";

const MoodService = {
  async createMood(userToken: string, mood: Mood): Promise<any> {
    try {
      const route: string = api + "v2/moods";

      const requestOptions = {
        method: "POST",
        body: mood.string,
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

  async getMoods(
    userToken: string,
    order?: string,
    limit?: number
  ): Promise<Mood[] | null> {
    try {
      const route: string = api + "moods";

      const requestOptions = {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      };

      let fullRoute: string = route;
      if (!!order || !!limit) fullRoute += "?";
      if (!!order) fullRoute += "order=" + order;
      if (!!order && !!limit) fullRoute += "&";
      if (!!limit) fullRoute += "limit=" + limit;

      const response = await fetch(fullRoute, requestOptions);

      const moodResponses: MoodResponse[] = await response.json();

      let moods: Mood[] = [];
      moodResponses.forEach((moodResponse: MoodResponse) => {
        moods.push(
          new Mood(
            moodResponse.data.value,
            moodResponse.data.userId,
            moodResponse.data.note,
            moodResponse.data.tags,
            moodResponse.data.date,
            moodResponse.id
          )
        );
      });
      return moods;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async deleteMood(userToken: string, moodId: string): Promise<any> {
    try {
      const route: string = api + "moods";

      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + userToken,
        },
      };

      return await fetch(route + "/" + moodId, requestOptions);
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default MoodService;
