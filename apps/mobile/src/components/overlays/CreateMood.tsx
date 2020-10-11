import React, { Component } from "react";
import Mood, { moodDescriptions } from "../../models/mood";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import MoodService from "../../services/MoodService";
import { User } from "firebase";
import sadAsset from "../../assets/svgs/FeelingBlue.svg";
import happyAsset from "../../assets/svgs/SmileyFace.svg";
import okayAsset from "../../assets/svgs/YoungAndHappy.svg";
import mehAsset from "../../assets/svgs/WindyDay.svg";
import MoodSlider from "../shared/MoodSlider";
import AddNote from "../shared/AddNote";
import AddTags from "../shared/AddTags";

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

class createMoodState {
  mood: number = 5;
  note: string = "";
  tags: string[] = [];
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
        <Emotion>{moodDescriptions[this.state.mood]}</Emotion>
        <Face>
          <img src={this.moodAsset} alt="Mood Illustration" width="80%" />
        </Face>
        <MoodSlider
          value={this.state.mood}
          updateValue={(value: number) => {
            this.setState({
              mood: value,
            });
          }}
        />
        <Additions>
          <AddNote setNote={(note: string) => this.setState({ note: note })} />
          <AddTags
            options={this.props.tagOptions}
            setTags={(tags: string[]) => this.setState({ tags: tags })}
          />
        </Additions>
        <Button onClick={async () => await this.createMood()}>Done</Button>
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
