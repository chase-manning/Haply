import React from "react";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";

const StyledLoadingLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const LoadingLine = () => {
  return (
    <StyledLoadingLine>
      <LinearProgress />
    </StyledLoadingLine>
  );
};

export default LoadingLine;
