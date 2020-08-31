import MoodService from "./MoodService";
import { MoodResponse, moodDescriptions } from "../models/mood";
import dateFormat from "dateformat";

export class Day {
  day: string;
  total: number = 0;
  count: number = 0;

  constructor(day: string) {
    this.day = day;
  }

  get average(): number {
    if (this.count === 0) return 0;
    return this.total / this.count;
  }

  get dayletter(): string {
    return this.day.slice(0, 1);
  }

  get percent(): string {
    return Math.round((this.total / this.count) * 10).toString() + "%";
  }

  addData(moodResponse: MoodResponse) {
    this.total += moodResponse.data.value;
    this.count += 1;
  }
}

const AnalyticsService = {
  async getDailyMoods(): Promise<Day[]> {
    const response: any = await MoodService.getMoods();
    const moods: MoodResponse[] = await response.json();
    let monday: Day = new Day("Monday");
    let tuesday: Day = new Day("Tuesday");
    let wednesday: Day = new Day("Wednesday");
    let thursday: Day = new Day("Thursday");
    let friday: Day = new Day("Friday");
    let saturday: Day = new Day("Saturday");
    let sunday: Day = new Day("Sunday");

    moods.forEach((moodResponse: MoodResponse) => {
      const day: string = dateFormat(moodResponse.data.date, "dddd");
      if (day === monday.day) monday.addData(moodResponse);
      else if (day === tuesday.day) tuesday.addData(moodResponse);
      else if (day === wednesday.day) wednesday.addData(moodResponse);
      else if (day === thursday.day) thursday.addData(moodResponse);
      else if (day === friday.day) friday.addData(moodResponse);
      else if (day === saturday.day) saturday.addData(moodResponse);
      else if (day === sunday.day) sunday.addData(moodResponse);
    });

    let days: Day[] = [];
    days.push(monday);
    days.push(tuesday);
    days.push(wednesday);
    days.push(thursday);
    days.push(friday);
    days.push(saturday);
    days.push(sunday);
    return days;
  },
};

export default AnalyticsService;
