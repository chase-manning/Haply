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
import { showError } from "../../state/navigationSlice";

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
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUxJREFUeNrM1sEJwkAQBdCsngXPHsQO9O5FS7AAMVYgdqAd2IGCDWgFnryLFQiCZ8EGnJUNimiyM/tnk4HNEAg/8y6ZmMRVqz9eUJvRaSbvutCZ347bXVJy/ZnvTmdJ862Me+hAbZCTs6GHpyUi1tTSvPnqTpoWZPUa7W7ncT3vK4h4zVejy8QzM3WhVUO8ykI6jOxoGA4ig3BLHcNFSCGqGAkig2yqgpEiMsjSfY9LxYQg7L6r0X6wS29YJiYQYecemY+wHrXD1+bklGhpAhBDeu/JfIVGxaAQ9sb8CI+CQSJ+QmJg0Ii/EE2MBiIXooHRQhRCkBhNhBcEhLkwf05ZCG8ICCOpk0MULmvDSY2M8UawIRExLIQIEgHDRoghihgRIgiigBEjgiFATBACAgFgghEwSAAGgoBCBBgYAg5hYKAIFYgHBo6w9RRgAFfy160QuV8NAAAAAElFTkSuQmCC");
  background-size: 10px;
  background-position: 85% center;
  background-repeat: no-repeat;
  padding-right: 30px;
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
  open: boolean;
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popup
      open={props.open}
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
                  reminderFrequencyMaximumInput: randomReminders
                    ? state.reminderFrequencyMaximumInput
                    : event.target.value,
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
                  reminderFrequencyMaximumDropdown: randomReminders
                    ? state.reminderFrequencyMaximumDropdown
                    : event.target.value,
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
        let minFrequency = frequency(
          state.reminderFrequencyMinimumInput,
          state.reminderFrequencyMinimumDropdown
        );

        let maxFrequncy = frequency(
          state.reminderFrequencyMaximumInput,
          state.reminderFrequencyMaximumDropdown
        );

        if (minFrequency <= 0 || maxFrequncy <= 0) {
          dispatch(showError("Reminder Frequencies must be above 0"));
          return;
        }

        if (randomReminders && minFrequency > maxFrequncy) {
          dispatch(
            showError("Minimum Reminder must be less than Maximum Reminder")
          );
          return;
        }

        if (minFrequency > 10080 || maxFrequncy > 10080) {
          dispatch(showError("Reminders can't be more than 7 days long"));
          return;
        }

        dispatch(setFrequencyMinutesMin(minFrequency));
        dispatch(setFrequencyMinutesMax(maxFrequncy));
      }}
    />
  );
};

export default ReminderPopup;
