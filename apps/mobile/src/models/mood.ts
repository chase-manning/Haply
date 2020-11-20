export default class Mood {
  userId: string;
  value: number;
  feelings: string[];
  activities: string[];
  places: string[];
  people: string[];
  date: Date;
  moodId?: string;
  note: string;

  constructor(
    userId: string,
    value: number,
    feelings: string[],
    activities: string[],
    places: string[],
    people: string[],
    note: string = "",
    date: Date = new Date(),
    moodId: string = ""
  ) {
    this.userId = userId;
    this.value = value;
    this.feelings = feelings;
    this.activities = activities;
    this.places = places;
    this.people = people;
    this.date = date;
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
