import React from "react";
import styled from "styled-components";
import { Header, Card } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";
import dateFormat from "dateformat";
import DynamicIcon from "../shared/DynamicIcon";

interface Month {
  month: string;
  dayAverages: DayAverage[];
}

const StyledCalendar = styled.div`
  width: 100%;
  display: flex;
  padding: 30px;
  flex-direction: column;
`;

const MonthSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Dates = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 15px;
`;

const Calendar = () => {
  const dayAverages = useSelector(selectDayAverages);
  let months: Month[] = [];

  dayAverages.forEach((dayAverage: DayAverage) => {
    const monthString = dateFormat(dayAverage.date, "mmmm yy");
    let month = months.filter((month: Month) => month.month === monthString);
    if (month.length > 0) month[0].dayAverages.push(dayAverage);
    else months.push({ month: monthString, dayAverages: [dayAverage] });
  });

  return (
    <StyledCalendar>
      {months.map((month: Month) => {
        return (
          <MonthSection>
            <Header>{month.month}</Header>
            <Card>
              <Dates>
                {month.dayAverages.map((dayAverage: DayAverage) => (
                  <DynamicIcon
                    percent={dayAverage.average / 10}
                    value={new Date(dayAverage.date).getDate()}
                  />
                ))}
              </Dates>
            </Card>
          </MonthSection>
        );
      })}
    </StyledCalendar>
  );
};

export default Calendar;
