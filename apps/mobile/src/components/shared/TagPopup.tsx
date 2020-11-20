import React, { useState } from "react";
import styled from "styled-components";
import Popup from "../shared/Popup";
import { SelectedTags, SelectedTag } from "../../styles/Shared";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import PremiumPopup from "./PremiumPopup";
import { showError } from "../../state/navigationSlice";

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
  color: var(--main);
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
  blockTagsPopupOpen: boolean = false;
}

type Props = {
  open: boolean;
  closePopup: () => void;
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  block: boolean;
};

const TagPopup = (props: Props) => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();

  return (
    <Popup
      open={props.open}
      content={
        <PopupContent>
          <SelectedTags>
            {props.tags.map((tag: string) => (
              <SelectedTag
                key={tag}
                onClick={() => dispatch(props.removeTag(tag))}
                includeMargin={true}
              >
                {tag}
                <TagIcon>
                  <CloseIcon fontSize={"inherit"} />
                </TagIcon>
              </SelectedTag>
            ))}
            <AddTag>
              <AddTagContent
                onClick={() => {
                  if (props.block)
                    setState({ ...state, blockTagsPopupOpen: true });
                  else setState({ ...state, newTagPopupOpen: true });
                }}
              >
                <AddTagText>Add</AddTagText>
                <TagIcon>
                  <AddIcon fontSize={"inherit"} />
                </TagIcon>
              </AddTagContent>
              <Popup
                open={state.newTagPopupOpen}
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
                submit={() => {
                  if (props.tags.indexOf(state.newTag) >= 0) {
                    dispatch(
                      showError("You can't add a Tag that already exists")
                    );
                    return;
                  }

                  if (state.newTag.length > 20) {
                    dispatch(showError("Tag is too long"));
                    return;
                  }

                  if (state.newTag === "") {
                    dispatch(showError("No value entered"));
                    return;
                  }

                  props.addTag(state.newTag);
                }}
              />
              <PremiumPopup
                header={"Tag Limit Exceeded"}
                description={
                  "You have run out of custom tags. Remove some tags or get Haply Premium to unlock unlimited custom tags"
                }
                open={state.blockTagsPopupOpen}
                close={() =>
                  setState({
                    ...state,
                    blockTagsPopupOpen: false,
                  })
                }
              />
            </AddTag>
          </SelectedTags>
        </PopupContent>
      }
      showButton={true}
      close={() => props.closePopup()}
    />
  );
};

export default TagPopup;
