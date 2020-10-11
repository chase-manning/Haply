import React, { Component } from "react";
import Mood, { moodDescriptions } from "../../models/mood";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import LocalOfferOutlined from "@material-ui/icons/LocalOfferOutlined";
import MoodService from "../../services/MoodService";
import { User } from "firebase";
import sadAsset from "../../assets/svgs/FeelingBlue.svg";
import happyAsset from "../../assets/svgs/SmileyFace.svg";
import okayAsset from "../../assets/svgs/YoungAndHappy.svg";
import mehAsset from "../../assets/svgs/WindyDay.svg";
import Popup from "../shared/Popup";
import { SelectedTag, SelectedTags } from "../../styles/Shared";
import MoodSlider from "../shared/MoodSlider";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  color: var(--main);
`;

const TopBar = styled.div`
  width: 100%;
`;

const Header = styled.div`
  font-size: 40px;
  text-align: center;
  font-weight: 500;
  color: var(--main);
`;

const Emotion = styled.div`
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  color: var(--sub);
`;

const Face = styled.div`
  height: 300px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Additions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Addition = styled.button`
  display: flex;
  align-items: center;
  color: var(--sub);
`;

const AdditionText = styled.p`
  margin: 0 10px;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bg);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--primary);
`;

const NoteContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoteBox = styled.textarea`
  width: 100%;
  height: 200px;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  resize: none;
  background-color: var(--bg-top);
  color: var(--main);
`;

const TagPopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SelectedTagsPlaceholderText = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-left: 5px;
  margin-top: 7px;
`;

const TagOptions = styled.div`
  width: 100%;
  border: solid 1px var(--border);
  border-radius: 15px;
  padding: 5px;
  background-color: var(--bg-top);
`;

const TagOption = styled.button`
  padding: 5px 8px;
  border-radius: 12px;
  background-color: var(--sub-light);
  font-size: 12px;
  margin: 0 5px 5px 0;
  color: var(--sub);
  display: inline-block;
  text-overflow: ellipsis;
`;

class createMoodState {
  mood: number = 5;
  description: string = moodDescriptions[this.mood];
  note: string = "";
  tags: string[] = [];
  noteOpen: boolean = false;
  tagsOpen: boolean = false;
}

type Props = {
  user: User;
  closeCapture: () => void;
  addMood: (mood: Mood) => void;
  tagOptions: string[];
};

export default class CreateMood extends Component<Props> {
  state: createMoodState;

  constructor(props: any) {
    super(props);
    this.state = new createMoodState();
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  handleNoteChange(event: any): void {
    this.setState({
      note: event.target.value,
    });
  }

  createMood(): void {
    const mood: Mood = new Mood(
      this.state.mood,
      this.props.user.uid,
      this.state.note,
      this.state.tags
    );
    MoodService.createMood(this.props.user, mood);
    this.props.addMood(mood);
    this.props.closeCapture();
  }

  render() {
    return (
      <StyledCreateMood>
        <TopBar>
          <Close onClick={() => this.props.closeCapture()} />
        </TopBar>
        <Header>How are you feeling?</Header>
        <Emotion>{this.state.description}</Emotion>
        <Face>
          <img src={this.moodAsset} alt="Mood Illustration" width="80%" />
        </Face>
        <MoodSlider
          value={this.state.mood}
          updateValue={(value: number) => {
            this.setState({
              mood: value,
              description: moodDescriptions[value],
            });
          }}
        />
        <Additions>
          <Addition onClick={() => this.setState({ noteOpen: true })}>
            <ChatBubbleOutline />
            <AdditionText>Note</AdditionText>
          </Addition>
          <Addition onClick={() => this.setState({ tagsOpen: true })}>
            <AdditionText>Tags</AdditionText>
            <LocalOfferOutlined />
          </Addition>
        </Additions>
        <Button onClick={async () => await this.createMood()}>Done</Button>
        {this.state.noteOpen && (
          <Popup
            content={
              <NoteContent>
                <NoteBox
                  value={this.state.note}
                  placeholder="Write Note here..."
                  onChange={this.handleNoteChange}
                />
              </NoteContent>
            }
            showButton={true}
            closePopup={() => this.setState({ noteOpen: false })}
          ></Popup>
        )}
        {this.state.tagsOpen && (
          <Popup
            content={
              <TagPopupContent>
                <SelectedTags>
                  {this.state.tags.map((tag: string) => (
                    <SelectedTag
                      includeMargin={true}
                      onClick={() => {
                        let tags: string[] = this.state.tags.filter(
                          (selectedTag: string) => selectedTag !== tag
                        );
                        this.setState({ tags: tags });
                      }}
                    >
                      {tag}
                    </SelectedTag>
                  ))}
                  {this.state.tags.length === 0 && (
                    <SelectedTagsPlaceholderText>
                      Select Tags Below...
                    </SelectedTagsPlaceholderText>
                  )}
                </SelectedTags>
                <TagOptions>
                  {this.props.tagOptions
                    .filter(
                      (tag: string) => this.state.tags.indexOf(tag) === -1
                    )
                    .map((tag: string) => (
                      <TagOption
                        onClick={() => {
                          let tags: string[] = this.state.tags;
                          tags.push(tag);
                          this.setState({ tags: tags });
                        }}
                      >
                        {tag}
                      </TagOption>
                    ))}
                </TagOptions>
              </TagPopupContent>
            }
            showButton={true}
            closePopup={() => this.setState({ tagsOpen: false })}
          ></Popup>
        )}
      </StyledCreateMood>
    );
  }

  get moodAsset(): string {
    if (this.state.mood <= 2) return sadAsset;
    if (this.state.mood <= 4) return mehAsset;
    else if (this.state.mood <= 7) return okayAsset;
    else return happyAsset;
  }
}
