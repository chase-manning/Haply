export enum StatType {
  Bar,
}

export type StatModel = {
  title: string;
  type: StatType;

  //Bar
  columns: Column[];
};

export type Column = {
  percent: number;
  label: string;
};
