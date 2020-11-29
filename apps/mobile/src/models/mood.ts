export default class Mood {
  userId: string;
  value: number;
  feelings: string[];
  activities: string[];
  places: string[];
  people: string[];
  date: Date;
  id?: string;
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
    id: string = ""
  ) {
    this.userId = userId;
    this.value = value;
    this.feelings = feelings;
    this.activities = activities;
    this.places = places;
    this.people = people;
    this.date = date;
    if (id !== "") this.id = id;
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
