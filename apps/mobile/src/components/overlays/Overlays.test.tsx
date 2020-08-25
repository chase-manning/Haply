import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Overlays from "./Overlays";

describe("<Overlays />", () => {
  test("it should mount", () => {
    render(<Overlays />);

    const overlays = screen.getByTestId("Overlays");

    expect(overlays).toBeInTheDocument();
  });
});
