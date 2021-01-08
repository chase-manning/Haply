import React from "react";
import styled from "styled-components";
import { Header, Card, HideComponentProps } from "../../styles/Shared";
import { useSelector } from "react-redux";
import { selectDayAverages, DayAverage } from "../../state/dataSlice";
import dateFormat from "dateformat";
import DynamicIcon from "../shared/DynamicIcon";
import LoadingLine from "../shared/LoadingLine";
import { selectDayAveragesLoading } from "../../state/loadingSlice";
import {
  EntriesTab,
  selectActiveTab,
  selectEntriesTab,
  Tab,
} from "../../state/navigationSlice";

interface Month {
  month: string;
  dayAverages: DayAverage[];
}

const StyledCalendar = styled.div`
  display: ${(props: HideComponentProps) => (props.show ? "flex" : "none")};
  width: 100%;
  padding: 15px 30px;
  flex-direction: column;
  position: relative;
`;

const MonthSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Dates = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-row-gap: 15px;
  justify-items: center;
`;

const Calendar = () => {
  const dayAveragesLoading = useSelector(selectDayAveragesLoading);
  const dayAverages = useSelector(selectDayAverages);
  const activeTab = useSelector(selectActiveTab);
  const entriesTab = useSelector(selectEntriesTab);

  let months: Month[] = [];

  if (!dayAverages || dayAverages.length > 0) return null;
  dayAverages.forEach((dayAverage: DayAverage) => {
    const monthString = dateFormat(dayAverage.date, "mmmm yyyy");
    let month = months.filter((month: Month) => month.month === monthString);
    if (month.length > 0) month[0].dayAverages.push(dayAverage);
    else months.push({ month: monthString, dayAverages: [dayAverage] });
  });

  const show =
    activeTab === Tab.Entries &&
    entriesTab === EntriesTab.Calander &&
    dayAverages &&
    dayAverages.length > 0;

  return (
    <StyledCalendar show={show}>
      <LoadingLine loading={dayAveragesLoading} />
      {months.map((month: Month) => {
        return (
          <MonthSection key={month.month}>
            <Header>{month.month}</Header>
            <Card>
              <Dates>
                {month.dayAverages.map((dayAverage: DayAverage) => (
                  <DynamicIcon
                    key={new Date(dayAverage.date).toISOString()}
                    percent={dayAverage.average / 10}
                    value={new Date(dayAverage.date).getDate()}
                    date={dateFormat(dayAverage.date, "m/d/yyyy")}
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
