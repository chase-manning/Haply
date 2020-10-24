export default class AchievementModel {
  svg: string;
  percentComplete: number;
  title: string;
  description: string;
  colorPrimary: string;
  unlocks: string[];
  isNew: boolean;

  constructor(
    svg: string,
    percentComplete: number,
    title: string,
    description: string,
    colorPrimary: string,
    unlocks: string[] = [],
    isNew: boolean = false
  ) {
    this.svg = svg;
    this.percentComplete = percentComplete;
    this.title = title;
    this.description = description;
    this.colorPrimary = colorPrimary;
    this.unlocks = unlocks;
    this.isNew = isNew;
  }
}
