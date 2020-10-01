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

export class SettingsModel {
  remindersEnabled: boolean = true;
  randomiseFrequency: boolean = false;
  frequencySecondsMin: number = 3 * 60 * 60;
  frequencySecondsMax: number = 3 * 60 * 60;
  sleepStart: number = 22;
  sleepEnd: number = 7;
}

export class Persist {
  user?: User;
  moods: Mood[] = [];
  stats: StatModel[] = [];
  achievements: AchievementModel[] = [];
  tagOptions: string[] = [
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
  pushNotificationToken?: string;
  settings: SettingsModel = new SettingsModel();

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
