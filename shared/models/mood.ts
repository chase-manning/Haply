export class Mood {
  value: number;
  date: Date;

  constructor(value: number, date: Date = new Date()) {
    this.value = value;
    this.date = date;
  }

  get json(): JSON {
    return JSON.parse(JSON.stringify(this));
  }
}
