import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Popup from "../shared/Popup";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFrequencyMinutesMax,
  selectFrequencyMinutesMin,
  selectRandomReminders,
  setFrequencyMinutesMax,
  setFrequencyMinutesMin,
} from "../../state/settingsSlice";

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PopupHeader = styled.div`
  color: var(--sub);
  font-size: 14px;
  margin-bottom: 10px;
`;

const FrequencyItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FrequencyInput = styled.input`
  width: 40%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;
const FrequencySelect = styled.select`
  width: 50%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;

const FrequencyOption = styled.option``;

const FrequencySecondItem = styled.div`
  margin-top: 20px;
`;

class State {
  reminderFrequencyMinimumInput: number = 3;
  reminderFrequencyMinimumDropdown: string = "Hours";
  reminderFrequencyMaximumInput: number = 3;
  reminderFrequencyMaximumDropdown: string = "Hours";
}

const getFrequencyInputFromMinutes = (minutes: number): number => {
  if (minutes < 60) return minutes;
  else if (minutes < 60 * 24) return minutes / 60;
  else return minutes / (60 * 24);
};

const getFrequencyDropdownFromMinutes = (minutes: number): string => {
  if (minutes < 60) return "Minutes";
  else if (minutes < 60 * 24) return "Hours";
  else return "Days";
};

const getFrequencyMultiplier = (frequencyDropdown: string): number => {
  if (frequencyDropdown === "Minutes") return 1;
  else if (frequencyDropdown === "Hours") return 60;
  else return 60 * 24;
};

const frequency = (input: number, period: string) =>
  input * getFrequencyMultiplier(period);

type Props = {
  closePopup: () => void;
};

const ReminderPopup = (props: Props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(new State());
  const randomReminders = useSelector(selectRandomReminders)!;
  const frequencyMinutesMin = useSelector(selectFrequencyMinutesMin);
  const frequencyMinutesMax = useSelector(selectFrequencyMinutesMax);

  useEffect(() => {
    setState({
      ...state,
      reminderFrequencyMinimumInput: getFrequencyInputFromMinutes(
        frequencyMinutesMin
      ),
      reminderFrequencyMinimumDropdown: getFrequencyDropdownFromMinutes(
        frequencyMinutesMin
      ),
      reminderFrequencyMaximumInput: getFrequencyInputFromMinutes(
        frequencyMinutesMax
      ),
      reminderFrequencyMaximumDropdown: getFrequencyDropdownFromMinutes(
        frequencyMinutesMax
      ),
    });
  }, []);

  return (
    <Popup
      content={
        <PopupContent>
          <PopupHeader>
            {randomReminders
              ? "At Minumum Remind me Every:"
              : "Remind me Every:"}
          </PopupHeader>
          <FrequencyItem>
            <FrequencyInput
              value={state.reminderFrequencyMinimumInput}
              onChange={(event: any) => {
                setState({
                  ...state,
                  reminderFrequencyMinimumInput: event.target.value,
                });
              }}
              type="number"
            />
            <FrequencySelect
              value={state.reminderFrequencyMinimumDropdown}
              onChange={(event: any) => {
                setState({
                  ...state,
                  reminderFrequencyMinimumDropdown: event.target.value,
                });
              }}
            >
              <FrequencyOption>Minutes</FrequencyOption>
              <FrequencyOption>Hours</FrequencyOption>
              <FrequencyOption>Days</FrequencyOption>
            </FrequencySelect>
          </FrequencyItem>
          {randomReminders && (
            <FrequencySecondItem>
              <PopupHeader>At Maximum Remind me Every:</PopupHeader>
              <FrequencyItem>
                <FrequencyInput
                  value={state.reminderFrequencyMaximumInput}
                  onChange={(event: any) => {
                    setState({
                      ...state,
                      reminderFrequencyMaximumInput: event.target.value,
                    });
                  }}
                  type="number"
                />
                <FrequencySelect
                  value={state.reminderFrequencyMaximumDropdown}
                  onChange={(event: any) => {
                    setState({
                      ...state,
                      reminderFrequencyMaximumDropdown: event.target.value,
                    });
                  }}
                >
                  <FrequencyOption>Minutes</FrequencyOption>
                  <FrequencyOption>Hours</FrequencyOption>
                  <FrequencyOption>Days</FrequencyOption>
                </FrequencySelect>
              </FrequencyItem>
            </FrequencySecondItem>
          )}
        </PopupContent>
      }
      showButton={true}
      close={() => props.closePopup()}
      submit={() => {
        dispatch(
          setFrequencyMinutesMin(
            frequency(
              state.reminderFrequencyMinimumInput,
              state.reminderFrequencyMinimumDropdown
            )
          )
        );
        dispatch(
          setFrequencyMinutesMax(
            frequency(
              state.reminderFrequencyMaximumInput,
              state.reminderFrequencyMaximumDropdown
            )
          )
        );
      }}
    />
  );
};

export default ReminderPopup;
