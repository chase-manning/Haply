import Mood, { MoodResponse } from "../models/mood";
import ApiService from "./ApiService";

export const createMood = async (mood: Mood): Promise<Mood> => {
  return await ApiService("apisMoodsCreateV2", "POST", mood.string);
};

export const getMoods = async (
  order?: string,
  limit?: number
): Promise<Mood[]> => {
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
};

export const deleteMood = async (id: string): Promise<any> => {
  return await ApiService("apisMoodsDeleteV1" + "/" + id, "DELETE");
};

export const getMoodsByDate = async (date: Date): Promise<Mood[]> => {
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
};
