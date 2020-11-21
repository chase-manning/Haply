import ApiService from "./ApiService";

interface DayAverage {
  date: Date;
  average: number;
}

const DayAveragesService = {
  async getDayAverages(): Promise<DayAverage[] | null> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisCalendarGetV1";
      const response = await ApiService(route, "GET");
      if (!response) return null;

      let dayAverages: DayAverage[] = await response!.json();

      return dayAverages;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default DayAveragesService;
