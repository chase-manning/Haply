import React, { useState } from "react";
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

type Props = {
  setNote: (note: string) => void;
};

const AddNote = (props: Props) => {
  const [state, setState] = useState({ note: "", popupOpen: false });

  return (
    <StyledAddNote>
      <Button onClick={() => setState({ ...state, popupOpen: true })}>
        <ChatBubbleOutline />
        <Label>Note</Label>
      </Button>
      {state.popupOpen && (
        <Popup
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
          closePopup={() => setState({ ...state, popupOpen: false })}
          submitPopup={() => {
            setState({ ...state, popupOpen: false });
            props.setNote(state.note);
          }}
        ></Popup>
      )}
    </StyledAddNote>
  );
};

export default AddNote;
