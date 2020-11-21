import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { DataPoint, StatModel } from "../../models/StatModel";
import {
  selectColorPrimary,
  selectColorSecondary,
} from "../../state/settingsSlice";

const options = {
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
    },
    displayColors: false,
    backgroundColor: "#FF6584",
  },
};

const StyledStatComparison = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type Props = {
  dataPoints: DataPoint[];
};

const StatComparison = (props: Props) => {
  const colorPrimary = useSelector(selectColorPrimary);
  const colorSecondary = useSelector(selectColorSecondary);

  const data = {
    //   labels: props.dataPoints.map((dataPoint: DataPoint) => dataPoint.label),
    labels: ["Outside", "Office", "Dairy", "Cafe", "School", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, -19, 3, 5, 2, 3],
        backgroundColor: [
          colorPrimary,
          colorSecondary,
          colorPrimary,
          colorPrimary,
          colorPrimary,
          colorPrimary,
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <StyledStatComparison>
      <HorizontalBar data={data} options={options} />
    </StyledStatComparison>
  );
};

export default StatComparison;
