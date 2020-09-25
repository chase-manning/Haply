import React, { Component } from "react";
import styled from "styled-components";
import { DataPoint } from "../../models/StatModel";
import { Line } from "react-chartjs-2";

const Chart = styled.div`
  width: 100%;
`;

const options = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "#9399A9",
          fontSize: "16",
        },
      },
    ],
    yAxes: [
      {
        display: false,
      },
    ],
  },
  tooltips: {
    callbacks: {
      title: function () {},
    },
    displayColors: false,
    backgroundColor: "#FF6584",
  },
};

type Props = {
  dataPoints: DataPoint[];
  colorPrimary: string;
};

export default class StatChart extends Component<Props> {
  render() {
    const data = {
      labels: this.props.dataPoints.map(
        (dataPoint: DataPoint) => dataPoint.label
      ),
      datasets: [
        {
          data: this.props.dataPoints.map(
            (dataPoint: DataPoint) => dataPoint.value
          ),
          backgroundColor: "rgba(64,114,253,0.1)",
          borderColor: this.props.colorPrimary,
          fill: false,
          pointRadius: 12,
          pointBorderColor: "rgba(0,0,0,0)",
          pointBackgroundColor: "rgba(0,0,0,0)",
        },
      ],
    };

    return (
      <Chart data-testid="StatChart">
        <Line data={data} options={options} />
      </Chart>
    );
  }
}
