import React, { useState } from "react";
import styled from "styled-components";
import Popup from "../shared/Popup";
import { SelectedTags, SelectedTag } from "../../styles/Shared";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTagOptions,
  removeTagOption,
  addTagOption,
} from "../../state/tempSlice";

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TagIcon = styled.div`
  font-size: 14px;
  margin-left: 2px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddTag = styled.div`
  height: 24px;
  border-radius: 12px;
  background-color: var(--sub-light);
  color: var(--sub);
  display: inline-block;
  font-size: 14px;
`;

const AddTagContent = styled.button`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`;

const AddTagText = styled.div`
  font-size: 12px;
  float: left;
`;

const TagInput = styled.input`
  width: 100%;
  border: solid 1px var(--border);
  padding: 20px;
  border-radius: 10px;
  outline: none;
  background-color: var(--bg-top);
  color: var(--main);
`;

class State {
  newTag: string = "";
  newTagPopupOpen: boolean = false;
}

const TagPopup = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const tagOptions = useSelector(selectTagOptions);

  return (
    <Popup
      content={
        <PopupContent>
          <SelectedTags>
            {tagOptions.map((tagOption: string) => (
              <SelectedTag
                onClick={() => dispatch(removeTagOption(tagOption))}
                includeMargin={true}
              >
                {tagOption}
                <TagIcon>
                  <CloseIcon fontSize={"inherit"} />
                </TagIcon>
              </SelectedTag>
            ))}
            <AddTag>
              <AddTagContent
                onClick={() => setState({ ...state, newTagPopupOpen: true })}
              >
                <AddTagText>Add</AddTagText>
                <TagIcon>
                  <AddIcon fontSize={"inherit"} />
                </TagIcon>
              </AddTagContent>
              {state.newTagPopupOpen && (
                <Popup
                  content={
                    <PopupContent>
                      <TagInput
                        value={state.newTag}
                        placeholder="New Tag..."
                        onChange={(event: any) =>
                          setState({
                            ...state,
                            newTag: event.target.value,
                          })
                        }
                      />
                    </PopupContent>
                  }
                  showButton={true}
                  close={() =>
                    setState({
                      ...state,
                      newTagPopupOpen: false,
                      newTag: "",
                    })
                  }
                  submit={() => dispatch(addTagOption(state.newTag))}
                />
              )}
            </AddTag>
          </SelectedTags>
        </PopupContent>
      }
      showButton={true}
      close={() => console.log("meow")}
    />
  );
};

export default TagPopup;
