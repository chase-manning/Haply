import ApiService from "./ApiService";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";

interface DayAverage {
  date: Date;
  average: number;
}

const DayAveragesService = {
  async getDayAverages(userToken: string): Promise<DayAverage[] | null> {
    try {
      const route: string = api + "v1/calendar";
      const response = await ApiService(route, userToken, "GET");
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
