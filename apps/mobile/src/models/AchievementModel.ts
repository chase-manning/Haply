export default class AchievementModel {
  svg: string;
  percentComplete: number;
  title: string;
  description: string;
  colorPrimary: string;

  constructor(
    svg: string,
    percentComplete: number,
    title: string,
    description: string,
    colorPrimary: string
  ) {
    this.svg = svg;
    this.percentComplete = percentComplete;
    this.title = title;
    this.description = description;
    this.colorPrimary = colorPrimary;
  }
}
