import React, { Component } from "react";
import styled from "styled-components";
import Close from "@material-ui/icons/Close";

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
`;

const DoneButton = styled.button`
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
  background-color: var(--bg-mid);
  margin-top: 20px;
`;

type Props = {
  content: JSX.Element;
  showButton: boolean;
  close: () => void;
  submit?: () => void;
};

export default class Popup extends Component<Props> {
  render() {
    return (
      <StyledPopup>
        <Shadow onClick={() => this.props.close()} />
        <Details>
          <Header>
            <ExitButton onClick={() => this.props.close()}>
              <Close />
            </ExitButton>
          </Header>
          {this.props.content}
          {this.props.showButton && (
            <DoneButton
              onClick={() => {
                if (this.props.submit) this.props.submit!();
                this.props.close();
              }}
            >
              Done
            </DoneButton>
          )}
        </Details>
      </StyledPopup>
    );
  }
}
