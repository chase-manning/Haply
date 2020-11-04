import React, { useState } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import Mood from "../../models/mood";
import Popup from "./Popup";
import { SelectedTag, SelectedTags, Card } from "../../styles/Shared";
import { useDispatch, useSelector } from "react-redux";
import { removeMood } from "../../state/dataSlice";
import { updateAll } from "../../state/loadingSlice";
import { selectToken } from "../../state/userSlice";
import DynamicIcon from "./DynamicIcon";

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
`;

const EntryText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
`;

const EntryHeader = styled.div`
  color: var(--main);
  font-size: 15px;
`;

const EntrySubHeader = styled.div`
  color: var(--sub);
  font-size: 11px;
`;

type EntryTagsProps = {
  open: boolean;
};

const EntryTags = styled.div`
  margin-top: 15px;
  color: var(--sub);
  font-size: 12px;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: ${(props: EntryTagsProps) => (props.open ? "auto" : "25px")};
  position: relative;
`;

type ExpandButtonProps = {
  show: boolean;
  secondLine: boolean;
};

const ExpandButton = styled.div`
  display: ${(props: ExpandButtonProps) => (props.show ? "flex" : "none")};
  position: absolute;
  top: ${(props: ExpandButtonProps) => (props.secondLine ? "15px" : "9px")};
  right: 0;
  background-color: var(--bg-mid);
  padding: 1px;
  font-size: 10px;
  color: var(--sub);
  box-shadow: -5px -0px 5px 2px var(--bg-mid);
`;

type EntryNoteProps = {
  open: boolean;
};

const EntryNote = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-top: 15px;
  width: 100%;
  height: ${(props: EntryNoteProps) => (props.open ? "auto" : "26px")};
  overflow: hidden;
  position: relative;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PopupHeader = styled.div`
  color: var(--main);
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
  text-align: center;
`;

const PopupDetails = styled.div`
  color: var(--sub);
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
`;

const HighlightedWord = styled.p`
  color: var(--main);
  margin-right: 5px;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--highlight);
  border: solid 1px var(--highlight);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--bg-mid);
  margin-top: 20px;
`;

class State {
  popupOpen: boolean = false;
  TagsOpen: boolean = false;
  notesOpen: boolean = false;
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
      {/* <Card onClick={() => setState({ ...state, popupOpen: true })}> */}
      <Card>
        <EntryContent>
          <Header>
            <DynamicIcon
              percent={props.mood.value / 10}
              value={props.mood.value}
            />
            <EntryText>
              <EntryHeader>{"Feeling " + props.mood.description}</EntryHeader>
              <EntrySubHeader>
                {dateFormat(props.mood.date, " dddd h:MM tt")}
              </EntrySubHeader>
            </EntryText>
          </Header>
          {props.mood.tags && props.mood.tags.length > 0 && (
            <EntryTags
              onClick={() => setState({ ...state, TagsOpen: !state.TagsOpen })}
              open={state.TagsOpen}
            >
              {props.mood.tags.map((tag: string) => (
                <SelectedTag key={tag} includeMargin={true}>
                  {tag}
                </SelectedTag>
              ))}
              <ExpandButton
                show={!state.TagsOpen && props.mood.tags.length >= 3}
                secondLine={false}
              >
                ...more
              </ExpandButton>
            </EntryTags>
          )}
          {props.mood.note && props.mood.note.length > 0 && (
            <EntryNote
              onClick={() =>
                setState({ ...state, notesOpen: !state.notesOpen })
              }
              open={state.notesOpen || props.mood.note.length < 20}
            >
              {props.mood.note.substring(0, 20000000) +
                (props.mood.note.length > 2000000 ? "..." : "")}
              <ExpandButton
                show={!state.notesOpen && props.mood.note.length >= 20}
                secondLine={true}
              >
                ...more
              </ExpandButton>
            </EntryNote>
          )}
        </EntryContent>
      </Card>
      <Popup
        open={state.popupOpen}
        content={
          <PopupContent>
            <PopupHeader>{props.mood.description}</PopupHeader>
            <PopupDetails>
              <HighlightedWord>Mood: </HighlightedWord>
              {props.mood.value}
            </PopupDetails>
            <PopupDetails>
              <HighlightedWord>Recorded: </HighlightedWord>
              {dateFormat(props.mood.date, "h:MM tt d/m/yy")}
            </PopupDetails>
            {props.mood.note.length > 0 && (
              <PopupDetails>
                <HighlightedWord>Note: </HighlightedWord>

                {props.mood.note}
              </PopupDetails>
            )}
            {props.mood.tags.length > 0 && (
              <PopupDetails>
                <SelectedTags>
                  {props.mood.tags.map((tag: string) => (
                    <SelectedTag key={tag} includeMargin={true}>
                      {tag}
                    </SelectedTag>
                  ))}
                </SelectedTags>
              </PopupDetails>
            )}
            <Button
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
              Delete
            </Button>
          </PopupContent>
        }
        showButton={false}
        close={() => setState({ ...state, popupOpen: false })}
      ></Popup>
    </StyledEntry>
  );
};

export default Entry;
