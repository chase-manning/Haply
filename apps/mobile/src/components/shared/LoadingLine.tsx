import React from "react";
import { LinearProgress, withStyles } from "@material-ui/core";
import styled from "styled-components";

const StyledLoadingLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

type Props = {
  loading: boolean;
};

const LoadingLine = (props: Props) => {
  const HaplyLinearProgress = withStyles(() => ({
    colorPrimary: {
      backgroundColor: "var(--primary-light)",
    },
    bar: {
      backgroundColor: "var(--primary)",
    },
  }))(LinearProgress);

  if (!props.loading) return null;
  return (
    <StyledLoadingLine>
      <HaplyLinearProgress />
    </StyledLoadingLine>
  );
};

export default LoadingLine;
