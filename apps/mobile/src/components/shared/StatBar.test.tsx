import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StatBar from "./StatBar";

describe("<StatBar />", () => {
  test("it should mount", () => {
    render(<StatBar />);

    const statBar = screen.getByTestId("StatBar");

    expect(statBar).toBeInTheDocument();
  });
});
