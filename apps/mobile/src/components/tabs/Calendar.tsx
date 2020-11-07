import React from "react";
import styled from "styled-components";
import { Header } from "../../styles/Shared";

const StyledCalendar = styled.div`
  width: 100%;
  display: flex;
  padding: 30px;
`;

const Calendar = () => {
  return (
    <StyledCalendar>
      <Header></Header>
    </StyledCalendar>
  );
};

export default Calendar;
