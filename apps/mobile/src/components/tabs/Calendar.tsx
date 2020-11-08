import React from "react";
import styled from "styled-components";
import { Header, Card } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";
import dateFormat from "dateformat";
import DynamicIcon from "../shared/DynamicIcon";
import LoadingLine from "../shared/LoadingLine";
import { selectDayAveragesLoading } from "../../state/loadingSlice";

interface Month {
  month: string;
  dayAverages: DayAverage[];
}

const StyledCalendar = styled.div`
  width: 100%;
  display: flex;
  padding: 15px 30px;
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
  justify-items: center;
`;

const Calendar = () => {
  const dayAveragesLoading = useSelector(selectDayAveragesLoading);
  const dayAverages = useSelector(selectDayAverages);
  let months: Month[] = [];

  if (dayAverages.length === 0) return null;
  dayAverages.forEach((dayAverage: DayAverage) => {
    const monthString = dateFormat(dayAverage.date, "mmmm yyyy");
    let month = months.filter((month: Month) => month.month === monthString);
    if (month.length > 0) month[0].dayAverages.push(dayAverage);
    else months.push({ month: monthString, dayAverages: [dayAverage] });
  });

  return (
    <StyledCalendar>
      <LoadingLine loading={dayAveragesLoading} />
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
