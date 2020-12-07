import React from "react";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";
import { Button } from "../../styles/Shared";

const StyledPopup = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Shadow = styled.button`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Details = styled.div`
  width: 80%;
  background-color: var(--bg-mid);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  justify-content: space-between;
  z-index: 3;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  color: var(--main);
`;

const ExitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--main);
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonGap = styled.div`
  width: 15px;
`;

type Props = {
  content: JSX.Element;
  open: boolean;
  showButton: boolean;
  showCancelButton?: boolean;
  close: () => void;
  submit?: () => void;
  cancel?: () => void;
  buttonText?: string;
  cancelButtonText?: string;
  important?: boolean;
};

const Popup = (props: Props) => {
  if (!props.open) return null;

  return (
    <StyledPopup>
      <Shadow
        onClick={() => {
          if (!props.important) props.close();
        }}
      />
      <Details>
        <Header>
          <ExitButton onClick={() => props.close()}>
            <Close />
          </ExitButton>
        </Header>
        {props.content}
        {props.showButton && (
          <Buttons>
            {props.showCancelButton && (
              <Button
                secondary={true}
                outline={true}
                onClick={() => {
                  if (props.cancel) props.cancel();
                }}
                marginTop={true}
              >
                {props.cancelButtonText || "No"}
              </Button>
            )}
            {props.showCancelButton && <ButtonGap />}

            <Button
              outline={true}
              onClick={() => {
                props.close();
                if (props.submit) props.submit!();
              }}
              marginTop={true}
            >
              {props.buttonText || "Done"}
            </Button>
          </Buttons>
        )}
      </Details>
    </StyledPopup>
  );
};

export default Popup;
