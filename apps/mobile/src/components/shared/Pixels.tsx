import React, { useState } from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Card } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";
import dateFormat from "dateformat";

interface Year {
  year: number;
  dayAverages: DayAverage[];
}

const StyledPixels = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 30px 60px 30px;
`;

const YearSelector = styled.div`
  width: 100%;
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const TransformContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

enum Position {
  Left,
  Active,
  Right,
}

type TransformProps = {
  position: Position;
};

const Transform = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: ${(props: TransformProps) => {
    if (props.position === Position.Left) return "translateX(-120%)";
    else if (props.position === Position.Right) return "translateX(120%)";
    else return "translateX(0%)";
  }};
  transition: all 0.5s ease-in-out;
`;

const YearContainer = styled.div`
  display: flex;
`;

const YearNavButton = styled.button`
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
  empty?: boolean;
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
  background-color: ${(props: PixelProps) => {
    if (props.primary) return "var(--primary)";
    else if (props.empty) return "var(--bg-mid)";
    else return "var(--highlight)";
  }};
  opacity: ${(props: PixelProps) => props.opacity};
  border: ${(props: PixelProps) =>
    props.empty ? "dashed 1px var(--sub)" : "none"};
`;

class State {
  yearIndex: number = 0;
}

const Pixels = () => {
  const [state, setState] = useState(new State());
  const dayAverages = useSelector(selectDayAverages);

  let years: Year[] = [];

  if (!dayAverages || !dayAverages.length || dayAverages.length === 0)
    return null;

  dayAverages.forEach((dayAverage: DayAverage) => {
    const yearNumber = Number.parseInt(dateFormat(dayAverage.date, "yyyym"));
    let year = years.filter((year: Year) => year.year === yearNumber);
    if (year.length > 0) year[0].dayAverages.push(dayAverage);
    else years.push({ year: yearNumber, dayAverages: [dayAverage] });
  });

  const activeYear = () => years[state.yearIndex].year;

  return (
    <StyledPixels>
      <YearSelector>
        <YearContainer>
          <YearNavButton
            disabled={!years.some((year: Year) => year.year < activeYear())}
            onClick={() =>
              setState({ ...state, yearIndex: state.yearIndex + 1 })
            }
          >
            <ArrowBackIosIcon />
          </YearNavButton>
          <Year>{activeYear()}</Year>
          <YearNavButton
            disabled={!years.some((year: Year) => year.year > activeYear())}
            onClick={() =>
              setState({ ...state, yearIndex: state.yearIndex - 1 })
            }
          >
            <ArrowForwardIosIcon />
          </YearNavButton>
        </YearContainer>
      </YearSelector>
      <TransformContainer>
        {years.map((year: Year) => (
          <Transform
            position={
              year.year < activeYear()
                ? Position.Left
                : year.year === activeYear()
                ? Position.Active
                : Position.Right
            }
          >
            <Card height={"100%"}>
              <PixelsContainer>
                {year.dayAverages.map((dayAverage: DayAverage) => (
                  <PixelContainer>
                    <Pixel opacity={1} />
                    <Pixel primary={true} opacity={dayAverage.average / 10} />
                    <Pixel
                      empty={dayAverage.average === -1}
                      opacity={dayAverage.average === -1 ? 1 : 0}
                    />
                  </PixelContainer>
                ))}
              </PixelsContainer>
            </Card>
          </Transform>
        ))}
      </TransformContainer>
    </StyledPixels>
  );
};

export default Pixels;
