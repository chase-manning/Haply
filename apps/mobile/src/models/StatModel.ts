export enum StatType {
  Bar,
  Chart,
}

export type StatModel = {
  title: string;
  type: StatType;

  //Bar
  dataPoints: DataPoint[];
};

export type DataPoint = {
  value: number;
  label: string;
};
