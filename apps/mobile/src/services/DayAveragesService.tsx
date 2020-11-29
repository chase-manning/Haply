import ApiService from "./ApiService";

interface DayAverage {
  date: Date;
  average: number;
}

export const getDayAverages = async (): Promise<DayAverage[]> => {
  let dayAverages: DayAverage[] = await ApiService("apisCalendarGetV1", "GET");
  return dayAverages;
};
