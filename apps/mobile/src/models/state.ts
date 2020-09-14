import { User } from "firebase";
import Mood from "./mood";

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

  get isSignedIn(): boolean {
    return !!this.user;
  }
}
