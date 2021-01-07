import React from "react";
import styled from "styled-components";

const PixelContainer = styled.div`
  justify-self: center;
  align-self: center;
  position: relative;
  width: 15px;
  height: 15px;
`;

const Pixel = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${(props: Props) => {
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
  opacity: ${(props: Props) =>
    props.averageMood ? props.averageMood / 10 : 1};
  border: ${(props: Props) =>
    props.pixelType === PixelType.FUTURE ? "solid 1px var(--sub)" : "none"};
`;

export enum PixelType {
  FUTURE,
  EMPTY,
  MOOD,
  HIGHLIGHT,
}

type Props = {
  pixelType: PixelType;
  averageMood?: number;
};

const Pixels = (props: Props) => {
  return (
    <PixelContainer>
      <Pixel pixelType={PixelType.MOOD} />
      {props.pixelType === PixelType.MOOD && (
        <Pixel
          pixelType={PixelType.HIGHLIGHT}
          averageMood={props.averageMood}
        />
      )}
    </PixelContainer>
  );
};

export default Pixels;
