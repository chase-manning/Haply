export default class Mood {
  value: number;
  date: Date;

  constructor(value: number, date: Date = new Date()) {
    this.value = value;
    this.date = date;
  }

  get string(): string {
    return JSON.stringify(this);
  }

  get json(): JSON {
    return JSON.parse(this.string);
  }
}
