import React, { useState } from "react";
import styled from "styled-components";
import { store } from "../../state/store";
import { Mode } from "../../state/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  disablePasscode,
  enablePasscode,
  selectPasscode,
} from "../../state/navigationSlice";
import ExitBar from "./ExitBar";

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
  font-size: 20px;
  background-color: var(--bg-mid);
  transition: all 0.2s ease-out;

  &:active:hover {
    transform: scale(0.99);
    box-shadow: var(--shadow-clicked);
    color: var(--primary);
  }
`;

export enum PasscodeMode {
  Set,
  Enter,
  Hidden,
}

class State {
  saved: string = "";
  passcode: string = "";
}

const Passcode = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState(new State());
  const passcode = useSelector(selectPasscode);
  console.log(passcode);

  console.log(!passcode);
  if (passcode === undefined) return null;

  console.log("inside");
  const headerText = () => {
    if (passcode.length === 0) {
      if (state.saved.length < 4) return "Set Passcode";
      else return "Confirm Passcode";
    } else return "Enter Passcode";
  };

  const add = (code: string) => {
    const newPasscode = state.passcode + code;
    if (newPasscode.length === 4) {
      if (state.saved.length === 4) {
        if (state.saved === newPasscode) dispatch(enablePasscode(newPasscode));
        else setState({ ...state, saved: "", passcode: "" });
      } else setState({ ...state, saved: newPasscode, passcode: "" });
    } else setState({ ...state, passcode: newPasscode });
  };

  return (
    <StyledPasscode>
      <ExitBar
        exit={() => dispatch(disablePasscode())}
        hideExit={passcode.length === 4}
      />
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
