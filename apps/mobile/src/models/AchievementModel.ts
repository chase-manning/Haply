export default class AchievementModel {
  svg: string;
  percentComplete: number;
  title: string;
  description: string;

  constructor(
    svg: string,
    percentComplete: number,
    title: string,
    description: string
  ) {
    this.svg = svg;
    this.percentComplete = percentComplete;
    this.title = title;
    this.description = description;
  }
}
