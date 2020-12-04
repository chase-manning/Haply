import React from "react";
import styled from "styled-components";
import { DataPoint } from "../../models/StatModel";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectColorPrimary } from "../../state/settingsSlice";

const Chart = styled.div`
  width: calc(100% + 20px);
  transform: translateY(-10px, -10px);
`;

const options = {
  elements: {
    line: {
      capBezierPoints: false,
    },
  },
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
        afterDataLimits(scale: any) {
          var range = scale.max - scale.min;
          var grace = range * 0.05;
          scale.max += grace;
          scale.min -= grace;
        },
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
};

const StatChart = (props: Props) => {
  const colorPrimary = useSelector(selectColorPrimary);

  const data = {
    labels: props.dataPoints.map((dataPoint: DataPoint) => dataPoint.label),
    datasets: [
      {
        data: props.dataPoints.map((dataPoint: DataPoint) => dataPoint.value),
        backgroundColor: "rgba(64,114,253,0.1)",
        borderColor: colorPrimary,
        fill: false,
        pointRadius:
          (window.innerWidth - 40 * 2) / (props.dataPoints.length * 2),
        pointHoverRadius:
          (window.innerWidth - 40 * 2) / (props.dataPoints.length * 2),
        pointBorderColor: "rgba(0,0,0,0)",
        pointBackgroundColor: "rgba(0,0,0,0)",
        clip: false,
      },
    ],
  };

  return (
    <Chart>
      <Line data={data} options={options} />
    </Chart>
  );
};

export default StatChart;
