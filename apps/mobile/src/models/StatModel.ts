export enum StatType {
  Bar,
  Chart,
}

export type StatModel = {
  title: string;
  type: StatType;
  locked: boolean;
  lockedMessage: string;
  percentComplete: number;
  new: boolean;

  //Bar
  dataPoints: DataPoint[];
};

export type DataPoint = {
  value: number;
  label: string;
};
