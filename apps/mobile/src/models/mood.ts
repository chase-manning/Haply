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
  moodId?: string;
  note: string;

  constructor(
    value: number,
    userId: string,
    note: string = "",
    date: Date = new Date(),
    moodId: string = ""
  ) {
    this.value = value;
    this.date = date;
    this.userId = userId;
    if (moodId !== "") this.moodId = moodId;
    this.note = note;
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
