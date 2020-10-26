export enum StatType {
  Bar,
  Chart,
  Percent,
}

export type StatModel = {
  title: string;
  type: StatType;
  locked: boolean;
  lockedMessage: string;
  percentComplete: number;
  isNew: boolean;

  //Bar
  dataPoints: DataPoint[];
};

export type DataPoint = {
  value: number;
  label: string;
};
