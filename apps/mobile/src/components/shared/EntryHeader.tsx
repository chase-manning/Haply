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
import ContextMenu from "./ContextMenu";

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
          onClick={() => {
            setState({ ...state, popupOpen: true });
            console.log("meow");
          }}
        />
        <ContextMenu
          open={state.popupOpen}
          close={() => {
            setState({ ...state, popupOpen: false });
            console.log("woof");
          }}
          options={[
            {
              text: "Delete",
              icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
              click: () => {
                dispatch(removeMood(props.mood));
                deleteMood(props.mood.id!).then(() => {
                  dispatch(updateAll());
                });
              },
            },
          ]}
          multiSelect={false}
        />
      </KebabMenu>
    </StyledEntryHeader>
  );
};

export default EntryHeader;
