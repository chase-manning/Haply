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
import { hideMood, selectMoodShowing } from "../../state/navigationSlice";
import { selectTagOptions } from "../../state/settingsSlice";
import { addMood, selectMoods } from "../../state/dataSlice";
import { updateAll } from "../../state/loadingSlice";
import { selectUser } from "../../state/userSlice";
import ExitBar from "../shared/ExitBar";
import { Button } from "../../styles/Shared";

const StyledCreateMood = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
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
  mood: number = 5;
  note: string = "";
  tags: string[] = [];
}

const moodAsset = (mood: number): string => {
  if (mood <= 2) return sadAsset;
  if (mood <= 4) return mehAsset;
  else if (mood <= 7) return okayAsset;
  else return happyAsset;
};

const CreateMood = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const moodShowing = useSelector(selectMoodShowing);
  const tagOptions = useSelector(selectTagOptions);
  const user = useSelector(selectUser);
  const moods = useSelector(selectMoods);

  if (!moodShowing) return null;

  return (
    <StyledCreateMood>
      {moods.length > 0 && <ExitBar exit={() => dispatch(hideMood())} />}
      <Header>How are you feeling?</Header>
      <Emotion>{moodDescriptions[state.mood]}</Emotion>
      <Face>
        <img src={moodAsset(state.mood)} alt="Mood Illustration" width="80%" />
      </Face>
      <MoodSlider
        value={state.mood}
        updateValue={(value: number) => {
          setState({
            ...state,
            mood: value,
          });
        }}
      />
      <Additions>
        <AddNote
          setNote={(note: string) => setState({ ...state, note: note })}
        />
        <AddTags
          options={tagOptions}
          setTags={(tags: string[]) => setState({ ...state, tags: tags })}
        />
      </Additions>
      <Button
        onClick={() => {
          const mood: Mood = new Mood(
            state.mood,
            user.id,
            state.note,
            state.tags
          );
          setState({ ...state, tags: [], note: "", mood: 5 });
          dispatch(addMood(mood));
          dispatch(hideMood());
          MoodService.createMood(user.token, mood).then(() => {
            dispatch(updateAll());
          });
        }}
      >
        Done
      </Button>
    </StyledCreateMood>
  );
};

export default CreateMood;
