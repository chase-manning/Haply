import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import styled from "styled-components";

const StyledLoadingSpinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--main-light);
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  loading: boolean;
};

const LoadingSpinner = (props: Props) => {
  const useStylesHaply = makeStyles(() => ({
    top: {
      color: "var(--primary)",
    },
    circle: {
      strokeLinecap: "round",
    },
  }));
  const classes = useStylesHaply();

  if (!props.loading) return null;
  return (
    <StyledLoadingSpinner>
      <CircularProgress
        variant="indeterminate"
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
