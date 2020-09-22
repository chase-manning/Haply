import React, { Component } from "react";
import Mood, { moodDescriptions } from "../../models/mood";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import LocalOfferOutlined from "@material-ui/icons/LocalOfferOutlined";
import Slider from "@material-ui/core/Slider";
import MoodService from "../../services/MoodService";
import { User } from "firebase";
import sadAsset from "../../assets/svgs/undraw_feeling_blue_4b7q.svg";
import happyAsset from "../../assets/svgs/undraw_smiley_face_lmgm.svg";
import okayAsset from "../../assets/svgs/undraw_young_and_happy_hfpe.svg";
import mehAsset from "../../assets/svgs/undraw_windy_day_x63l.svg";
import Popup from "../shared/Popup";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: white;
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
  color: var(--sub);
  margin-bottom: 10px;
`;

const Addition = styled.div`
  display: flex;
  align-items: center;
`;

const AdditionText = styled.p`
  margin: 0 10px;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border: none;
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--primary);
  filter: var(--primary-shadow);
  outline: none;
`;

const NoteContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoteBox = styled.textarea`
  width: 100%;
  margin-bottom: 30px;
  height: 200px;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  resize: none;
`;

const NoteButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary);
  border: solid 1px var(--primary);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: white;
  outline: none;
`;

const MoodSlider = withStyles({
  root: {
    color: "var(--primary)",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

class createMoodState {
  mood: number = 5;
  description: string = moodDescriptions[this.mood];
  note: string = "";
  noteOpen: boolean = false;
  tagsOpen: boolean = false;
}

type Props = {
  user: User;
  closeCapture: () => void;
  addMood: (mood: Mood) => void;
};

export default class CreateMood extends Component<Props> {
  state: createMoodState;

  constructor(props: any) {
    super(props);
    this.state = new createMoodState();
    this.handleChange = this.handleChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  handleChange(event: any, newValue: any): void {
    this.setState({
      mood: newValue,
      description: moodDescriptions[newValue],
    });
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
      this.state.note
    );
    MoodService.createMood(this.props.user, mood);
    this.props.addMood(mood);
    this.props.closeCapture();
  }

  render() {
    const tagsPopupContent = <p>Tags Popup</p>;

    return (
      <StyledCreateMood data-testid="Capture">
        <TopBar>
          <Close onClick={() => this.props.closeCapture()} />
        </TopBar>
        <Header>How are you feeling?</Header>
        <Emotion>{this.state.description}</Emotion>
        <Face>
          <img src={this.moodAsset} alt="Mood Illustration" width="80%" />
        </Face>
        <MoodSlider
          name="mood"
          value={this.state.mood}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={10}
          onChange={this.handleChange}
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
                ></NoteBox>
                <NoteButton onClick={() => this.setState({ noteOpen: false })}>
                  Done
                </NoteButton>
              </NoteContent>
            }
            closePopup={() => this.setState({ noteOpen: false })}
          ></Popup>
        )}
        {this.state.tagsOpen && (
          <Popup
            content={tagsPopupContent}
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
