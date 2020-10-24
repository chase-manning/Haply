import { StatModel } from "../models/StatModel";
import ApiService from "./ApiService";

const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";

const StatService = {
  async getStats(userToken: string): Promise<StatModel[] | null> {
    try {
      console.log("Getting Stats");
      const route: string = api + "stats";

      const requestOptions = {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      };

      const response = await ApiService(route, requestOptions);
      if (!response) return null;

      const stats: StatModel[] = await response!.json();

      return stats;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default StatService;
