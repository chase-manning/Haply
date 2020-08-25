import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Tabs from "./Tabs";

describe("<Tabs />", () => {
  test("it should mount", () => {
    render(<Tabs />);

    const tabs = screen.getByTestId("Tabs");

    expect(tabs).toBeInTheDocument();
  });
});
