import React from "react";
import { LinearProgress } from "@material-ui/core";
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
  if (!props.loading) return null;
  return (
    <StyledLoadingLine>
      <LinearProgress />
    </StyledLoadingLine>
  );
};

export default LoadingLine;
