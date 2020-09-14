import { User } from "firebase";
import Mood from "./mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "./AchievementModel";

export enum Tab {
  Profile,
  Entries,
  Stats,
  Settings,
}

export default class State {
  activeTab: Tab = Tab.Profile;
  moodShowing: boolean = false;
  user?: User;
  loggingIn: boolean = false;
  moods: Mood[] = [];
  stats: StatModel[] = [];
  achievements: AchievementModel[] = [];

  get isSignedIn(): boolean {
    return !!this.user;
  }
}
