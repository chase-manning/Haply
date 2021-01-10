import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { DataPoint } from "../../models/StatModel";
import {
  selectColorPrimary,
  selectColorSecondary,
} from "../../state/settingsSlice";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "#9399A9",
          fontSize: "12",
          autoSkip: false,
        },
      },
    ],
    xAxes: [
      {
        display: false,
      },
    ],
  },
  tooltips: {
    callbacks: {
      title: function () {},
      label: function (tooltipItem: any, data: any) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var currentValue = dataset.data[tooltipItem.index];
        var percent = Math.round(currentValue * 100);
        return percent + "%";
      },
    },
    displayColors: false,
    backgroundColor: "#FF6584",
  },
};

type StatProps = {
  height: number;
};

const StyledStatComparison = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: ${(props: StatProps) => props.height + "px"};
`;

type Props = {
  dataPoints: DataPoint[];
};

const StatComparison = (props: Props) => {
  const colorPrimary = useSelector(selectColorPrimary);
  const colorSecondary = useSelector(selectColorSecondary);

  const data = {
    labels: props.dataPoints.map((dataPoint: DataPoint) => dataPoint.label),
    datasets: [
      {
        label: "",
        data: props.dataPoints.map((dataPoint: DataPoint) => dataPoint.value),
        backgroundColor: props.dataPoints.map((dataPoint: DataPoint) =>
          dataPoint.value >= 0 ? colorPrimary : colorSecondary
        ),
        borderWidth: 0,
      },
    ],
  };

  const height = Math.max(props.dataPoints.length * 18, 150);

  return (
    <StyledStatComparison height={height}>
      <HorizontalBar data={data} options={options} />
    </StyledStatComparison>
  );
};

export default StatComparison;
