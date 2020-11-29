import { StatModel } from "../models/StatModel";
import ApiService from "./ApiService";

const StatService = {
  async getStats(currentStats: StatModel[]): Promise<StatModel[] | null> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisStatsGetV2";
      let stats: StatModel[] = await ApiService(route, "GET");
      stats = getStatsWithIsNew(currentStats, stats);
      return stats;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

const getStatsWithIsNew = (
  currentStats: StatModel[],
  newStats: StatModel[]
): StatModel[] => {
  if (currentStats.length === 0) return newStats;
  newStats
    .filter((newStat: StatModel) => newStat.percentComplete === 1)
    .forEach((newStat: StatModel) => {
      let currentStatList = currentStats.filter(
        (stat: StatModel) => stat.title === newStat.title
      );
      if (currentStatList.length > 0) {
        let currentStat = currentStatList[0];
        if (
          currentStat &&
          currentStat.percentComplete < 1 &&
          newStat.percentComplete === 1
        )
          newStat.isNew = true;
      }
    });
  return newStats;
};

export default StatService;
