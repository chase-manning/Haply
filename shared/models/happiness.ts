export class Happiness {
  value: number;
  date: Date;

  constructor(value: number, date: Date = new Date()) {
    this.value = value;
    this.date = date;
  }
}
