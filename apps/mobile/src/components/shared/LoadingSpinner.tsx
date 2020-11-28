import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import styled from "styled-components";
import LoadingCircle from "./LoadingCircle";

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
  if (!props.loading) return null;
  return (
    <StyledLoadingSpinner>
      <LoadingCircle color={"var(--primary)"} size={40} />
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
