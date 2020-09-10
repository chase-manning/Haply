import React, { Component } from "react";
import styled from "styled-components";
import { DataPoint } from "../../models/StatModel";
import { Line } from "react-chartjs-2";

const Chart = styled.div`
  width: 100%;
`;

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "First dataset",
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76],
      fill: false,
      borderColor: "#742774",
    },
  ],
};

type Props = {
  dataPoints: DataPoint[];
};

export default class StatChart extends Component<Props> {
  render() {
    return (
      <Chart data-testid="StatChart">
        <Line data={data} />
      </Chart>
    );
  }
}
