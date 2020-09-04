export const moodDescriptions: string[] = [
  "...",
  "Miserable",
  "Dreadful",
  "Lousy",
  "Meh",
  "Okay",
  "Content",
  "Good",
  "Great",
  "Awesome",
  "Amazing!",
];

export default class Mood {
  value: number;
  date: Date;
  userId: string;

  constructor(value: number, userId: string, date: Date = new Date()) {
    this.value = value;
    this.date = date;
    this.userId = userId;
  }

  get string(): string {
    return JSON.stringify(this);
  }

  get json(): JSON {
    return JSON.parse(this.string);
  }
}

export type MoodResponse = {
  id: string;
  data: Mood;
};
