import React, { Component } from "react";
import Mood from "../../models/mood";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Slider from "@material-ui/core/Slider";
import MoodService from "../../services/MoodService";

const StyledCapture = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--red);
`;

type Opacity = {
  opacity: number;
};
const BackgroundOverlayYellow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--yellow);
  opacity: ${(props: Opacity) => props.opacity};
  transition: opacity 0.5s;
`;

const BackgroundOverlayBlue = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--blue);
  opacity: ${(props: Opacity) => props.opacity};
  transition: opacity 0.5s;
`;

const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  color: var(--main);
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
  color: var(--main);
`;

const Comment = styled.div`
  display: none;
  align-items: center;
  color: var(--main);
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main);
  color: white;
  border: none;
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
`;

const moodDescriptions: string[] = [
  "Miserable",
  "Dreadful",
  "Lousy",
  "Meh",
  "Okay",
  "Content",
  "Good",
  "Great",
  "Awesome",
  "Amazing",
];

class captureState {
  mood: number = 7;
  description: string = moodDescriptions[this.mood - 1];
}

type Props = {
  closeCapture: () => void;
};

export default class Capture extends Component<Props> {
  state: captureState;

  constructor(props: any) {
    super(props);
    this.state = new captureState();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any, newValue: any): void {
    this.setState({
      mood: newValue,
      description: moodDescriptions[newValue - 1],
    });
  }

  async createMood(): Promise<void> {
    const mood: Mood = new Mood(this.state.mood);
    const response = await MoodService.createMood(mood);
    if (!response || !response.ok) {
      alert("Mood Creation Failed");
      return;
    }
    this.props.closeCapture();
  }

  render() {
    return (
      <StyledCapture data-testid="Capture">
        <BackgroundOverlayYellow
          opacity={Math.min(1, (this.state.mood - 1) / 4)}
        />
        <BackgroundOverlayBlue
          opacity={Math.max(0, (this.state.mood - 5) / 5)}
        />
        <ContentContainer>
          <Close onClick={() => this.props.closeCapture()} />
          <Header>How are you feeling?</Header>
          <Emotion>{this.state.description}</Emotion>
          <div>Face</div>
          <Slider
            name="mood"
            value={this.state.mood}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            onChange={this.handleChange}
          />
          <Comment>
            <ChatBubbleOutline />
            Add a comment
          </Comment>
          <Button onClick={async () => await this.createMood()}>Done</Button>
        </ContentContainer>
      </StyledCapture>
    );
  }
}
