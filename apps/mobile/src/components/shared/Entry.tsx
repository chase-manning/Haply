import React, { Component } from "react";
import styled from "styled-components";
//import DeleteOutline from "@material-ui/icons/DeleteOutline";
import dateFormat from "dateformat";
import MoodService from "../../services/MoodService";
import Mood from "../../models/mood";
import { User } from "firebase";
import Popup from "./Popup";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { SelectedTag, SelectedTags, Line } from "../../styles/Shared";

const StyledEntry = styled.div`
  width: 100%;
`;

const EntryText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  text-align: left;
`;

const EntryHeader = styled.div`
  color: var(--main);
  margin-bottom: 10px;
`;

const EntrySubHeader = styled.div`
  color: var(--sub);
  font-size: 12px;
`;

const EntryNote = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-bottom: 10px;
`;

const EntryTags = styled.div`
  color: var(--sub);
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const EntryTagMoreText = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-left: 5px;
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
}

type Props = {
  user: User;
  mood: Mood;
  removeMood: (mood: Mood) => void;
};

export default class Entry extends Component<Props> {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  async deleteMood(): Promise<void> {
    this.setState({ popupOpen: false });
    MoodService.deleteMood(this.props.user, this.props.mood.moodId!);
    this.props.removeMood(this.props.mood);
  }

  render() {
    return (
      <StyledEntry data-testid="Entry">
        <Line onClick={() => this.setState({ popupOpen: true })}>
          <EntryText>
            <EntryHeader>{this.props.mood.description}</EntryHeader>
            <EntrySubHeader>
              {dateFormat(this.props.mood.date, " dddd h:MM tt")}
            </EntrySubHeader>
          </EntryText>
          <EntryText>
            <EntryNote>
              {this.props.mood.note.substring(0, 20) +
                (this.props.mood.note.length > 20 ? "..." : "")}
            </EntryNote>
            <EntryTags>
              {this.props.mood.tags.slice(0, 1).map((tag: string) => (
                <SelectedTag includeMargin={false}>{tag}</SelectedTag>
              ))}
              {this.props.mood.tags.length > 1 && (
                <EntryTagMoreText>
                  +{this.props.mood.tags.length - 1}
                </EntryTagMoreText>
              )}
            </EntryTags>
          </EntryText>
          <ChevronRight />
        </Line>
        {this.state.popupOpen && (
          <Popup
            content={
              <PopupContent>
                <PopupHeader>{this.props.mood.description}</PopupHeader>
                <PopupDetails>
                  <HighlightedWord>Mood: </HighlightedWord>
                  {this.props.mood.value}
                </PopupDetails>
                <PopupDetails>
                  <HighlightedWord>Recorded: </HighlightedWord>
                  {dateFormat(this.props.mood.date, "h:MM tt d/m/yy")}
                </PopupDetails>
                {this.props.mood.note.length > 0 && (
                  <PopupDetails>
                    <HighlightedWord>Note: </HighlightedWord>

                    {this.props.mood.note}
                  </PopupDetails>
                )}
                {this.props.mood.tags.length > 0 && (
                  <PopupDetails>
                    <SelectedTags>
                      {this.props.mood.tags.map((tag: string) => (
                        <SelectedTag includeMargin={true}>{tag}</SelectedTag>
                      ))}
                    </SelectedTags>
                  </PopupDetails>
                )}
                <Button onClick={() => this.deleteMood()}>Delete</Button>
              </PopupContent>
            }
            showButton={false}
            close={() => this.setState({ popupOpen: false })}
          ></Popup>
        )}
      </StyledEntry>
    );
  }
}
