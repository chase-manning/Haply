import React, { useState } from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Card } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";

const StyledPixels = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
`;

const YearSelector = styled.div`
  width: 100%;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const YearContainer = styled.div`
  display: flex;
`;

const YearNavButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Year = styled.div`
  font-size: 20px;
  margin: 0 20px;
`;

const PixelsContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px;
`;

const PixelContainer = styled.div`
  justify-self: center;
  align-self: center;
  position: relative;
  width: 20px;
  height: 20px;
`;

type PixelProps = {
  primary?: boolean;
  opacity: number;
};

const Pixel = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${(props: PixelProps) =>
    props.primary ? "var(--primary)" : "var(--highlight)"};
  opacity: ${(props: PixelProps) => props.opacity};
`;

class State {
  year: number = new Date().getFullYear();
}

const Pixels = () => {
  const [state, setState] = useState(new State());
  const dayAverages = useSelector(selectDayAverages);

  return (
    <StyledPixels>
      <YearSelector>
        <YearContainer>
          <YearNavButton>
            <ArrowBackIosIcon />
          </YearNavButton>
          <Year>{state.year}</Year>
          <YearNavButton>
            <ArrowForwardIosIcon />
          </YearNavButton>
        </YearContainer>
      </YearSelector>
      <Card height={"100%"}>
        <PixelsContainer>
          {dayAverages.map((dayAverage: DayAverage) => (
            <PixelContainer>
              <Pixel opacity={1} />{" "}
              <Pixel primary={true} opacity={dayAverage.average / 10} />
            </PixelContainer>
          ))}
        </PixelsContainer>
      </Card>
    </StyledPixels>
  );
};

export default Pixels;
