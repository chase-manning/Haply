import Mood, { MoodResponse } from "../models/mood";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";

const route: string = api + "moods";

const MoodService = {
  async createMood(mood: Mood): Promise<any> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: mood.string,
    };
    try {
      return await fetch(route, requestOptions);
    } catch {
      return null;
    }
  },

  async getMoods(userId: string, order?: string, limit?: number): Promise<any> {
    let fullRoute: string = route + "?userId=" + userId;
    if (!!order) fullRoute += "&order=" + order;
    if (!!limit) fullRoute += "&limit=" + limit;

    try {
      return await fetch(fullRoute);
    } catch {
      return null;
    }
  },

  async deleteMood(moodId: string): Promise<any> {
    const requestOptions = {
      method: "DELETE",
    };
    try {
      return await fetch(route + "/" + moodId, requestOptions);
    } catch {
      return null;
    }
  },

  async averageMood(userId: string): Promise<number> {
    let fullRoute: string = route + "?userId=" + userId + "&limit=100";
    try {
      const response = await fetch(fullRoute);
      const moodResponses: MoodResponse[] = await response.json();
      if (moodResponses.length === 0) return 0;
      let moodTotal: number = 0;
      moodResponses.forEach((moodResponse: MoodResponse) => {
        moodTotal += moodResponse.data.value;
      });
      return moodTotal / moodResponses.length;
    } catch {
      return 0;
    }
  },
};

export default MoodService;
