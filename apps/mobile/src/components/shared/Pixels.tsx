import React, { useState } from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Card } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";
import dateFormat from "dateformat";
import LoadingLine from "./LoadingLine";
import { selectDayAveragesLoading } from "../../state/loadingSlice";
import Pixel from "./Pixel";

interface Year {
  year: number;
  dayAverages: DayAverage[];
}

const StyledPixels = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 30px 60px 30px;
  position: relative;
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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-row-gap: 10px;
`;

class State {
  yearIndex: number = 0;
}

const Pixels = () => {
  const [state, setState] = useState(new State());
  const dayAverages = useSelector(selectDayAverages);
  const dayAveragesLoading = useSelector(selectDayAveragesLoading);

  let years: Year[] = [];

  if (!dayAverages || !dayAverages.length || dayAverages.length === 0)
    return null;

  dayAverages.forEach((dayAverage: DayAverage) => {
    const yearNumber = Number.parseInt(dateFormat(dayAverage.date, "yyyy"));
    let year = years.filter((year: Year) => year.year === yearNumber);
    if (year.length > 0) year[0].dayAverages.push(dayAverage);
    else years.push({ year: yearNumber, dayAverages: [dayAverage] });
  });

  years.forEach((year: Year) => {
    const lastDate = new Date(
      year.dayAverages[year.dayAverages.length - 1].date
    );
    lastDate.setDate(lastDate.getDate() + 1);
    while (dateFormat(lastDate, "yyyy") === year.year.toString()) {
      year.dayAverages.unshift({ date: new Date(lastDate), average: -2 });
      lastDate.setDate(lastDate.getDate() + 1);
    }
  });

  const activeYear = () => years[state.yearIndex].year;

  return (
    <StyledPixels>
      <LoadingLine loading={dayAveragesLoading} />
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
            key={year.year}
            position={
              year.year < activeYear()
                ? Position.Left
                : year.year === activeYear()
                ? Position.Active
                : Position.Right
            }
          >
            <Card>
              <PixelsContainer>
                {year.dayAverages.map((dayAverage: DayAverage) => (
                  <Pixel averageMood={dayAverage.average} />
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
