export enum StatType {
  Bar,
  Chart,
  Percent,
  Comparison,
}

export type StatModel = {
  title: string;
  type: StatType;
  locked: boolean;
  lockedMessage: string;
  percentComplete: number;
  isNew: boolean;
  dataPoints: DataPoint[];
};

export type DataPoint = {
  value: number;
  label: string;
};
