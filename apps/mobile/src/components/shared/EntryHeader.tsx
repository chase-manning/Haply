import React, { useState } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
import { deleteMood } from "../../services/MoodService";
import Mood from "../../models/mood";
import { useDispatch } from "react-redux";
import { removeMood } from "../../state/dataSlice";
import {
  updateAll,
  updateDayAverages,
  updateStats,
} from "../../state/loadingSlice";
import DynamicIcon from "./DynamicIcon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import ContextMenu from "./ContextMenu";
import Failed from "./Failed";

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

const KebabMenu = styled.div`
  color: var(--sub);
  position: relative;
  height: 24px;
`;

class State {
  popupOpen: boolean = false;
  error: boolean = false;
}

type Props = {
  mood: Mood;
  load: () => void;
  complete: () => void;
};

const EntryHeader = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();

  const deleteEntry = () => {
    props.load();
    deleteMood(props.mood.id!)
      .then(() => {
        dispatch(removeMood(props.mood));
        dispatch(updateStats());
        dispatch(updateDayAverages());
      })
      .catch(() => {})
      .finally(() => props.complete());
  };

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
        <MoreVertIcon onClick={() => setState({ ...state, popupOpen: true })} />
        <ContextMenu
          open={state.popupOpen}
          close={() => setState({ ...state, popupOpen: false })}
          options={[
            {
              text: "Delete",
              icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
              click: () => deleteEntry(),
            },
          ]}
          multiSelect={false}
        />
      </KebabMenu>
      <Failed
        open={state.error}
        close={() => setState({ ...state, error: false })}
        action={"Mood Deletion"}
        tryAgain={() => deleteEntry()}
      />
    </StyledEntryHeader>
  );
};

export default EntryHeader;
