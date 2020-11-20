import React, { useState } from "react";
import Mood, { moodDescriptions } from "../../models/mood";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import sadAsset from "../../assets/svgs/FeelingBlue.svg";
import happyAsset from "../../assets/svgs/SmileyFace.svg";
import okayAsset from "../../assets/svgs/YoungAndHappy.svg";
import mehAsset from "../../assets/svgs/WindyDay.svg";
import MoodSlider from "../shared/MoodSlider";
import AddNote from "../shared/AddNote";
import AddTags from "../shared/AddTags";
import { useSelector, useDispatch } from "react-redux";
import {
  hideMood,
  selectMoodShowing,
  selectMoodDateSearch,
} from "../../state/navigationSlice";
import { addMood, selectMoods } from "../../state/dataSlice";
import { updateAll, updateDateSearchMoods } from "../../state/loadingSlice";
import { selectUser } from "../../state/userSlice";
import ExitBar from "../shared/ExitBar";
import { Button } from "../../styles/Shared";
import {
  selectActivities,
  selectFeelings,
  selectPeople,
  selectPlaces,
} from "../../state/settingsSlice";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  color: var(--main);
`;

const Header = styled.div`
  font-size: 40px;
  text-align: center;
  font-weight: 500;
  color: var(--main);
`;

const Emotion = styled.div`
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  color: var(--sub);
`;

const Tags = styled.div`
  width: 100%;
  font-size: 24px;
`;

const TagSection = styled.div`
  display: inline-block;
  margin-bottom: 10px;
`;

const TagText = styled.div`
  color: var(--main);
  display: inline-block;
  margin-right: 10px;
`;

const TagSelected = styled.div`
  color: var(--primary);
  display: inline-block;
  min-width: 50px;
  min-height: 30px;
  border-bottom: solid 2px var(--primary);
  margin-right: 10px;
  position: relative;
`;

const TagClickHandler = styled.button`
  width: 100%;
  height: 30px;
  position: absolute;
`;

const TagOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-mid);
  border-radius: 10px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  z-index: 2;
  font-size: 16px;
`;

type TagOptionProps = {
  selected: boolean;
};

const TagOption = styled.div`
  color: ${(props: TagOptionProps) =>
    props.selected ? "var(--primary)" : "var(--main)"};
  padding: 5px 0;
`;

const TagExit = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: var(--main-light);
`;

const Face = styled.div`
  height: 300px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Additions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

class State {
  tags: string[] = [];
  open: boolean = false;
}

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
};

const TagInput = (props: Props) => {
  const [state, setState] = useState(new State());

  return (
    <TagSelected>
      <TagClickHandler onClick={() => setState({ ...state, open: true })} />
      {state.open && (
        <TagExit
          onClick={() => {
            setState({ ...state, open: false });
            props.setTags(state.tags);
          }}
        />
      )}
      {state.open && (
        <TagOptions>
          {props.tags.map((tag: string) => (
            <TagOption
              key={tag}
              selected={state.tags.indexOf(tag) >= 0}
              onClick={() => {
                const index = state.tags.indexOf(tag);
                const newFeelings = state.tags;
                if (index >= 0) newFeelings.splice(index, 1);
                else newFeelings.push(tag);
                setState({ ...state, tags: newFeelings });
              }}
            >
              {tag}
            </TagOption>
          ))}
        </TagOptions>
      )}
    </TagSelected>
  );
};

export default TagInput;
