import React, { useState } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
import { deleteMood } from "../../services/MoodService";
import Mood from "../../models/mood";
import { useDispatch } from "react-redux";
import { removeMood } from "../../state/dataSlice";
import { updateAll } from "../../state/loadingSlice";
import DynamicIcon from "./DynamicIcon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

const StyledEntryHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  margin-left: 15px;
`;

const Header = styled.div`
  color: var(--main);
  font-size: 15px;
`;

const SubHeader = styled.div`
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

const EntryHeader = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();

  return (
    <StyledEntryHeader>
      <HeaderLeft>
        <DynamicIcon percent={props.mood.value / 10} value={props.mood.value} />
        <Text>
          <Header>{dateFormat(props.mood.date, " dddd h:MM tt")}</Header>
          <SubHeader>{dateFormat(props.mood.date, "dS mmmm yyyy")}</SubHeader>
        </Text>
      </HeaderLeft>
      <KebabMenu>
        <MoreVertIcon
          onClick={() => setState({ ...state, popupOpen: !state.popupOpen })}
        />
        {state.popupOpen && (
          <ContextMenu
            onClick={() => {
              setState({ ...state, popupOpen: false });
              dispatch(removeMood(props.mood));
              deleteMood(props.mood.id!).then(() => {
                dispatch(updateAll());
              });
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
    </StyledEntryHeader>
  );
};

export default EntryHeader;
