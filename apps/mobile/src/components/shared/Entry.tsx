import React, { useState } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import Mood from "../../models/mood";
import { Card } from "../../styles/Shared";
import { useDispatch, useSelector } from "react-redux";
import { removeMood } from "../../state/dataSlice";
import { updateAll } from "../../state/loadingSlice";
import { selectToken } from "../../state/userSlice";
import DynamicIcon from "./DynamicIcon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EntryTags from "./EntryTags";
import EntryNote from "./EntryNote";

const StyledEntry = styled.div`
  width: 100%;
`;

const EntryContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
`;

const EntryText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  margin-left: 15px;
`;

const EntryHeader = styled.div`
  color: var(--main);
  font-size: 15px;
`;

const EntrySubHeader = styled.div`
  color: var(--sub);
  font-size: 11px;
`;

const KebabMenu = styled.button`
  color: var(--sub);
  position: relative;
`;

const ContextMenu = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 15px);
  background-color: var(--bg-mid);
  border-radius: 6px;
  display: flex;
  z-index: 1;
`;

const ContextColor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: var(--sub-light);
`;

const ContentItem = styled.button`
  display: flex;
  color: var(--main);
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 2px;
`;

const ContextIcon = styled.div`
  transform: scale(0.65);
`;

const ItemLabel = styled.div`
  margin-right: 10px;
`;

class State {
  popupOpen: boolean = false;
}

type Props = {
  mood: Mood;
};

const Entry = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const userToken = useSelector(selectToken);

  return (
    <StyledEntry>
      <Card>
        <EntryContent>
          <Header>
            <HeaderLeft>
              <DynamicIcon
                percent={props.mood.value / 10}
                value={props.mood.value}
              />
              <EntryText>
                <EntryHeader>{"Feeling " + props.mood.value}</EntryHeader>
                <EntrySubHeader>
                  {dateFormat(props.mood.date, " dddd h:MM tt")}
                </EntrySubHeader>
              </EntryText>
            </HeaderLeft>
            <KebabMenu>
              <MoreVertIcon
                onClick={() =>
                  setState({ ...state, popupOpen: !state.popupOpen })
                }
              />
              {state.popupOpen && (
                <ContextMenu
                  onClick={() => {
                    setState({ ...state, popupOpen: false });
                    dispatch(removeMood(props.mood));
                    MoodService.deleteMood(userToken, props.mood.moodId!).then(
                      () => {
                        dispatch(updateAll());
                      }
                    );
                  }}
                >
                  <ContextColor />
                  <ContentItem>
                    <ContextIcon>
                      <DeleteOutlineOutlinedIcon />
                    </ContextIcon>
                    <ItemLabel>Delete</ItemLabel>
                  </ContentItem>
                </ContextMenu>
              )}
            </KebabMenu>
          </Header>
          <EntryTags tags={props.mood.tags} percent={props.mood.value / 10} />
          <EntryNote note={props.mood.note} />
        </EntryContent>
      </Card>
    </StyledEntry>
  );
};

export default Entry;
