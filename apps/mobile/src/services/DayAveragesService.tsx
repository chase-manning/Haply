import ApiService from "./ApiService";

interface DayAverage {
  date: Date;
  average: number;
}

const DayAveragesService = {
  async getDayAverages(): Promise<DayAverage[] | null> {
    try {
      let dayAverages: DayAverage[] = await ApiService(
        "apisCalendarGetV1",
        "GET"
      );

      return dayAverages;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default DayAveragesService;
