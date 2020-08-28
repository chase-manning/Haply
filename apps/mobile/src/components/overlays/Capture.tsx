import React, { Component } from "react";
import Mood, { moodDescriptions } from "../../models/mood";
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
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  color: var(--main);
`;

type Opacity = {
  opacity: number;
};

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
  color: white;
  border: none;
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--primary);
  filter: var(--primary-shadow);
`;

class captureState {
  mood: number = 5;
  description: string = moodDescriptions[this.mood];
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
      description: moodDescriptions[newValue],
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
          min={0}
          max={10}
          onChange={this.handleChange}
        />
        <Comment>
          <ChatBubbleOutline />
          Add a comment
        </Comment>
        <Button onClick={async () => await this.createMood()}>Done</Button>
      </StyledCapture>
    );
  }
}
