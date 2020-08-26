import React, { Component } from "react";
import Mood from "../../models/mood";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Slider from "@material-ui/core/Slider";

const StyledCapture = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  background-color: white;
  padding: 40px;
`;

const Header = styled.div`
  font-size: 40px;
  text-align: center;
  font-weight: 500;
`;

const Emotion = styled.div`
  font-weight: 400;
  font-size: 20px;
  text-align: center;
`;

const Comment = styled.div`
  display: none;
  align-items: center;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
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
    this.meow = this.meow.bind(this);
  }

  woof(): void {
    this.props.closeCapture();
  }

  meow(): void {
    const mood: Mood = new Mood(this.state.mood);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: mood.string,
    };
    fetch(
      "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/moods",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => this.woof());
  }

  handleChange(event: any, newValue: any): void {
    this.setState({
      mood: newValue,
      description: moodDescriptions[newValue - 1],
    });
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
          min={1}
          max={10}
          onChange={this.handleChange}
        />
        <Comment>
          <ChatBubbleOutline />
          Add a comment
        </Comment>
        <Button onClick={this.meow}>Done</Button>
      </StyledCapture>
    );
  }
}
