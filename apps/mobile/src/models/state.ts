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

export enum Mode {
  Default,
  Dark,
  Light,
}

export class Persist {
  user?: User;
  moods: Mood[] = [];
  stats: StatModel[] = [];
  achievements: AchievementModel[] = [];
  tabOptions: string[] = [
    "With Friends",
    "With Family",
    "Tired",
    "Well Rested",
    "In Pain",
    "Sick",
    "Working",
    "At Home",
    "On Holiday",
    "Eating Well",
    "Eating Poorly",
    "Exercising",
  ];
  colorPrimary: string = "#4071FE";
  mode: Mode = Mode.Default;

  get isSignedIn(): boolean {
    return !!this.user;
  }
}

export default class State {
  activeTab: Tab = Tab.Profile;
  moodShowing: boolean = false;
  loggingIn: boolean = false;
  persist: Persist = new Persist();
}
