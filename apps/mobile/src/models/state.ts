import { User } from "firebase";

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
}
