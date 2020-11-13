import React, { useState } from "react";
import styled from "styled-components";
import { store } from "../../state/store";

const StyledPasscode = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 100;
`;

const Header = styled.div`
  color: var(--main);
  font-size: 18px;
  text-transform: uppercase;
  margin-bottom: 15px;
`;

const Pins = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

type PinProps = {
  filled?: boolean;
};

const Pin = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: solid 1px var(--primary);
  background-color: ${(props: PinProps) =>
    props.filled ? "var(--primary)" : "none"};
  margin: 7px;
`;

const Numbers = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;

const Number = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow);
  transition: all 0.2s ease-out;
  font-size: 20px;
  background-color: var(--bg-mid);

  &:active:hover {
    transform: scale(0.99);
    box-shadow: var(--shadow-clicked);
  }
`;

export enum PasscodeMode {
  Set,
  Confirm,
  Enter,
}

class State {
  passcode: string = "";
}

type Props = {
  mode: PasscodeMode;
};

const Passcode = (props: Props) => {
  const [state, setState] = useState(new State());

  const headerText = () => {
    switch (props.mode) {
      case PasscodeMode.Set:
        return "Set Passcode";
      case PasscodeMode.Confirm:
        return "Confirm Passcode";
      case PasscodeMode.Enter:
        return "Enter Passcode";
      default:
        return "ERROR";
    }
  };

  const add = (code: string) =>
    setState({ ...state, passcode: state.passcode + code });

  return (
    <StyledPasscode>
      <Header>{headerText()}</Header>
      <Pins>
        <Pin filled={state.passcode.length >= 1} />
        <Pin filled={state.passcode.length >= 2} />
        <Pin filled={state.passcode.length >= 3} />
        <Pin filled={state.passcode.length >= 4} />
      </Pins>
      <Numbers>
        <Number onClick={() => add("1")}>1</Number>
        <Number onClick={() => add("2")}>2</Number>
        <Number onClick={() => add("3")}>3</Number>
        <Number onClick={() => add("4")}>4</Number>
        <Number onClick={() => add("5")}>5</Number>
        <Number onClick={() => add("6")}>6</Number>
        <Number onClick={() => add("7")}>7</Number>
        <Number onClick={() => add("8")}>8</Number>
        <Number onClick={() => add("9")}>9</Number>
        <div />
        <Number onClick={() => add("0")}>0</Number>
        <div />
      </Numbers>
    </StyledPasscode>
  );
};

export default Passcode;
