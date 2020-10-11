import React, { Component } from "react";
import styled from "styled-components";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Popup from "../shared/Popup";

const StyledAddNote = styled.div``;

const Button = styled.button`
  display: flex;
  align-items: center;
  color: var(--sub);
`;

const Label = styled.p`
  margin: 0 10px;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.textarea`
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

class State {
  note: string = "";
  popupOpen: boolean = false;
}

type Props = {
  setNote: (note: string) => void;
};

export default class AddNote extends Component<Props> {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any): void {
    this.setState({
      note: event.target.value,
    });
  }

  render() {
    return (
      <StyledAddNote>
        <Button onClick={() => this.setState({ popupOpen: true })}>
          <ChatBubbleOutline />
          <Label>Note</Label>
        </Button>
        {this.state.popupOpen && (
          <Popup
            content={
              <PopupContent>
                <Input
                  value={this.state.note}
                  placeholder="Write Note here..."
                  onChange={this.handleChange}
                />
              </PopupContent>
            }
            showButton={true}
            closePopup={() => this.setState({ popupOpen: false })}
            submitPopup={() => this.props.setNote(this.state.note)}
          ></Popup>
        )}
      </StyledAddNote>
    );
  }
}
