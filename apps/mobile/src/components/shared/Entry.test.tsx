import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Entry from "./Entry";

describe("<Entry />", () => {
  test("it should mount", () => {
    render(<Entry />);

    const entry = screen.getByTestId("Entry");

    expect(entry).toBeInTheDocument();
  });
});
