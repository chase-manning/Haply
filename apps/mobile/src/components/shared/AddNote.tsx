import React, { useState } from "react";
import styled from "styled-components";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Popup from "../shared/Popup";
import { notEqual } from "assert";
import { useDispatch } from "react-redux";
import { showError } from "../../state/navigationSlice";

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

const AddNote = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();

  return (
    <StyledAddNote>
      <Button onClick={() => setState({ ...state, popupOpen: true })}>
        <ChatBubbleOutline />
        <Label>Note</Label>
      </Button>
      <Popup
        open={state.popupOpen}
        content={
          <PopupContent>
            <Input
              value={state.note}
              placeholder="Write Note here..."
              onChange={(event: any) =>
                setState({ ...state, note: event.target.value })
              }
            />
          </PopupContent>
        }
        showButton={true}
        close={() => setState({ ...state, popupOpen: false })}
        submit={() => {
          if (state.note.length > 8000) {
            dispatch(showError("Note is to long"));
            return;
          }
          props.setNote(state.note);
        }}
      ></Popup>
    </StyledAddNote>
  );
};

export default AddNote;
