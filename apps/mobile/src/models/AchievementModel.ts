export default class AchievementModel {
  svg: string;
  percentComplete: number;

  constructor(svg: string, percentComplete: number) {
    this.svg = svg;
    this.percentComplete = percentComplete;
  }
}
