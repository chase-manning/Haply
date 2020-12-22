import { StatModel } from "../models/StatModel";
import ApiService from "./ApiService";

export const getStats = async (
  currentStats: StatModel[]
): Promise<StatModel[] | null> => {
  let stats: StatModel[] = await ApiService("apisStatsGetV3", "GET");
  return getStatsWithIsNew(currentStats, stats);
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
