import React from "react";
import styled from "styled-components";

export enum PixelType {
  FUTURE,
  EMPTY,
  MOOD,
  HIGHLIGHT,
}

const PixelContainer = styled.div`
  justify-self: center;
  align-self: center;
  position: relative;
  width: 15px;
  height: 15px;
`;

type StyledPixelProps = {
  pixelType: PixelType;
  averageMood?: number;
};

const StyledPixel = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${(props: StyledPixelProps) => {
    switch (props.pixelType) {
      case PixelType.FUTURE:
        return "var(--bg-mid)";
      case PixelType.EMPTY:
        return "var(--sub)";
      case PixelType.MOOD:
        return "var(--highlight)";
      case PixelType.HIGHLIGHT:
        return "var(--primary)";
      default:
        throw new Error("Pixel Type Not Supported");
    }
  }};
  opacity: ${(props: StyledPixelProps) =>
    props.averageMood ? props.averageMood / 10 : 1};
  border: ${(props: StyledPixelProps) =>
    props.pixelType === PixelType.FUTURE ? "solid 1px var(--sub)" : "none"};
`;

type Props = {
  averageMood: number;
};

const Pixel = (props: Props) => {
  const pixelType = () => {
    switch (props.averageMood) {
      case -1:
        return PixelType.EMPTY;
      case -2:
        return PixelType.FUTURE;
      default:
        return PixelType.MOOD;
    }
  };

  return (
    <PixelContainer>
      <StyledPixel pixelType={pixelType()} />
      {props.averageMood >= 0 && (
        <StyledPixel
          pixelType={PixelType.HIGHLIGHT}
          averageMood={props.averageMood}
        />
      )}
    </PixelContainer>
  );
};

export default Pixel;
