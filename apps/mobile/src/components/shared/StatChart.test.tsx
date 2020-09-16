import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StatChart from "./StatChart";

describe("<StatChart />", () => {
  test("it should mount", () => {
    render(<StatChart />);

    const statChart = screen.getByTestId("StatChart");

    expect(statChart).toBeInTheDocument();
  });
});
