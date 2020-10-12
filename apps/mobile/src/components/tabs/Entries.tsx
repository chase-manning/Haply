import React from "react";
import styled from "styled-components";
import Entry from "../shared/Entry";
import Mood from "../../models/mood";
import noData from "../../assets/svgs/Empty.svg";
import { selectMoods } from "../../state/dataSlice";
import { useSelector } from "react-redux";
import { User } from "firebase";

const StyledEntries = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const NoDataContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoDataHeader = styled.div`
  font-size: 16px;
  color: var(--main);
  margin-top: 30px;
`;

const NoDataSub = styled.div`
  font-size: 12px;
  margin-top: 15px;
  color: var(--sub);
  width: 70%;
  text-align: center;
  line-height: 1.5;
`;

type Props = {
  user: User;
};

const Entries = (props: Props) => {
  const moods = useSelector(selectMoods);

  return (
    <StyledEntries data-testid="Entries">
      {moods.length > 0 &&
        moods
          .slice(0, 30)
          .map((mood: Mood) => <Entry mood={mood} user={props.user} />)}
      {moods.length === 0 && (
        <NoDataContainer>
          <NoData>
            <img src={noData} alt="No Data Found Illustration" width="60%" />
            <NoDataHeader>No Entries</NoDataHeader>
            <NoDataSub>
              Record how you are Feeling. New Entries will appear here.
            </NoDataSub>
          </NoData>
        </NoDataContainer>
      )}
    </StyledEntries>
  );
};

export default Entries;
