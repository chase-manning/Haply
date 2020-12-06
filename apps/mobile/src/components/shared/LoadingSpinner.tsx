import React from "react";
import styled from "styled-components";
import LoadingCircle from "./LoadingCircle";

type SpinnerProps = {
  borderRadius: number;
};

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
  border-radius: ${(props: SpinnerProps) => props.borderRadius + "px"};
`;

type Props = {
  loading: boolean;
  borderRadius?: number;
};

const LoadingSpinner = (props: Props) => {
  if (!props.loading) return null;
  return (
    <StyledLoadingSpinner borderRadius={props.borderRadius || 0}>
      <LoadingCircle color={"var(--primary)"} size={40} />
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
