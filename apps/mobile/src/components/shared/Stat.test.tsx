import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Stat from "./Stat";

describe("<Stat />", () => {
  test("it should mount", () => {
    render(<Stat />);

    const stat = screen.getByTestId("Stat");

    expect(stat).toBeInTheDocument();
  });
});
