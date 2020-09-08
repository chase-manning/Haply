import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Achievement from "./Achievement";

describe("<Achievement />", () => {
  test("it should mount", () => {
    render(<Achievement />);

    const entry = screen.getByTestId("Achievement");

    expect(entry).toBeInTheDocument();
  });
});
