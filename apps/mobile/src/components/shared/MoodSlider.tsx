import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const MoodSliderValues = withStyles({
  root: {
    color: "var(--primary)",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "var(--bg)",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
    "& *": {
      background: "var(--primary)",
      color: "var(--bg)",
    },
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

type Props = {
  value: number;
  updateValue: (value: number) => void;
};

export default class MoodSlider extends Component<Props> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <MoodSliderValues
        name="mood"
        value={this.props.value}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={0}
        max={10}
        onChange={this.handleChange}
      />
    );
  }

  handleChange(event: any, newValue: any): void {
    this.props.updateValue(newValue);
  }
}
