import Mood from "./mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "./AchievementModel";

export class Persist {
  pushNotificationToken?: string;
}

export default class State {
  persist: Persist = new Persist();
}
