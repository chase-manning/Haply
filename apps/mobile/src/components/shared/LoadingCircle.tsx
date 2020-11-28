import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";

type Props = {
  color: string;
  size: number;
};

const LoadingCircle = (props: Props) => {
  const useStylesHaply = makeStyles(() => ({
    top: {
      color: props.color,
    },
    circle: {
      strokeLinecap: "round",
    },
  }));
  const classes = useStylesHaply();

  return (
    <CircularProgress
      variant="indeterminate"
      className={classes.top}
      classes={{
        circle: classes.circle,
      }}
      size={props.size}
      thickness={4}
    />
  );
};

export default LoadingCircle;
