import ApiService from "./ApiService";

interface DayAverage {
  date: Date;
  average: number;
}

const DayAveragesService = {
  async getDayAverages(): Promise<DayAverage[]> {
    let dayAverages: DayAverage[] = await ApiService(
      "apisCalendarGetV1",
      "GET"
    );
    return dayAverages;
  },
};

export default DayAveragesService;
