import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  disablePasscode,
  enablePasscode,
  lock,
  selectLocked,
  selectPasscode,
  unlock,
} from "../../state/navigationSlice";
import ExitBar from "./ExitBar";
import { Plugins } from "@capacitor/core";

const { App, Storage, Haptics } = Plugins;

const StyledPasscode = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  z-index: 100;
`;

const PasscodeContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  color: var(--main);

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
  const locked = useSelector(selectLocked);

  useEffect(() => {
    loadPasscode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  App.addListener("appStateChange", () => {
    loadPasscode();
  });

  const loadPasscode = () => {
    Storage.get({ key: "passcode" }).then((result: any) => {
      let ret: { value: any } = result;
      if (!ret.value || ret.value.length < 4) return;
      dispatch(enablePasscode(ret.value));
      dispatch(lock());
    });
  };

  if (passcode === undefined || (passcode.length === 4 && !locked)) return null;

  const headerText = () => {
    if (passcode.length === 0) {
      if (state.saved.length < 4) return "Set Passcode";
      else return "Confirm Passcode";
    } else return "Enter Passcode";
  };

  const reset = () => setState({ ...state, saved: "", passcode: "" });

  const add = (code: string) => {
    const newPasscode = state.passcode + code;
    if (newPasscode.length === 4) {
      if (locked) {
        if (newPasscode === passcode) dispatch(unlock());
        else Haptics.vibrate();
        reset();
      } else if (state.saved.length === 4) {
        if (state.saved === newPasscode) dispatch(enablePasscode(newPasscode));
        reset();
      } else setState({ ...state, saved: newPasscode, passcode: "" });
    } else setState({ ...state, passcode: newPasscode });
  };

  return (
    <StyledPasscode>
      <ExitBar
        exit={() => {
          dispatch(disablePasscode());
          reset();
        }}
        hideExit={passcode.length === 4}
      />
      <PasscodeContent>
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
      </PasscodeContent>
      <div />
    </StyledPasscode>
  );
};

export default Passcode;
