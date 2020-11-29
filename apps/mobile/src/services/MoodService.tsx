import Mood, { MoodResponse } from "../models/mood";
import ApiService from "./ApiService";

const MoodService = {
  async createMood(mood: Mood): Promise<Mood> {
    return await ApiService("apisMoodsCreateV2", "POST", mood.string);
  },

  async getMoods(order?: string, limit?: number): Promise<Mood[] | null> {
    try {
      let fullRoute: string = "apisMoodsGetV1";
      if (!!order || !!limit) fullRoute += "?";
      if (!!order) fullRoute += "order=" + order;
      if (!!order && !!limit) fullRoute += "&";
      if (!!limit) fullRoute += "limit=" + limit;

      const moodResponses: MoodResponse[] = await ApiService(fullRoute, "GET");

      let moods: Mood[] = [];
      moodResponses.forEach((moodResponse: MoodResponse) => {
        moods.push(
          new Mood(
            moodResponse.data.userId,
            moodResponse.data.value,
            moodResponse.data.feelings,
            moodResponse.data.activities,
            moodResponse.data.places,
            moodResponse.data.people,
            moodResponse.data.note,
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

  async deleteMood(moodId: string): Promise<any> {
    try {
      return await ApiService("apisMoodsDeleteV1" + "/" + moodId, "DELETE");
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getMoodsByDate(date: Date) {
    try {
      const startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      endDate.setDate(endDate.getDate() + 1);

      const route: string =
        "apisMoodsGetV1?startdate=" +
        startDate.toISOString() +
        "&enddate=" +
        endDate.toISOString();

      const moodResponses: MoodResponse[] = await ApiService(route, "GET");

      let moods: Mood[] = [];
      moodResponses.forEach((moodResponse: MoodResponse) => {
        moods.push(
          new Mood(
            moodResponse.data.userId,
            moodResponse.data.value,
            moodResponse.data.feelings,
            moodResponse.data.activities,
            moodResponse.data.places,
            moodResponse.data.people,
            moodResponse.data.note,
            moodResponse.data.date,
            moodResponse.id
          )
        );
      });
      return moods.reverse();
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default MoodService;
