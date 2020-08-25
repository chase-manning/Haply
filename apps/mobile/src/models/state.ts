export enum Tab {
  Profile,
  Entries,
  Stats,
  Settings,
}

export default class State {
  activeTab: Tab;

  constructor() {
    this.activeTab = Tab.Profile;
  }
}
