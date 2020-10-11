import React, { Component } from "react";
import styled from "styled-components";
import LocalOfferOutlined from "@material-ui/icons/LocalOfferOutlined";
import Popup from "../shared/Popup";
import { SelectedTag, SelectedTags } from "../../styles/Shared";

const StyledAddTags = styled.div``;

const Button = styled.button`
  display: flex;
  align-items: center;
  color: var(--sub);
`;

const Label = styled.p`
  margin: 0 10px;
`;

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PlaceholderText = styled.div`
  color: var(--sub);
  font-size: 12px;
  margin-left: 5px;
  margin-top: 7px;
`;

const Options = styled.div`
  width: 100%;
  border: solid 1px var(--border);
  border-radius: 15px;
  padding: 5px;
  background-color: var(--bg-top);
`;

const Option = styled.button`
  padding: 5px 8px;
  border-radius: 12px;
  background-color: var(--sub-light);
  font-size: 12px;
  margin: 0 5px 5px 0;
  color: var(--sub);
  display: inline-block;
  text-overflow: ellipsis;
`;

class State {
  tags: string[] = [];
  popupOpen: boolean = false;
}

type Props = {
  options: string[];
  setTags: (tags: string[]) => void;
};

export default class AddTags extends Component<Props> {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = new State();
  }

  render() {
    return (
      <StyledAddTags>
        <Button onClick={() => this.setState({ popupOpen: true })}>
          <Label>Tags</Label>
          <LocalOfferOutlined />
        </Button>
        {this.state.popupOpen && (
          <Popup
            content={
              <PopupContent>
                <SelectedTags>
                  {this.state.tags.map((tag: string) => (
                    <SelectedTag
                      includeMargin={true}
                      onClick={() => {
                        let tags: string[] = this.state.tags.filter(
                          (selectedTag: string) => selectedTag !== tag
                        );
                        this.setState({ tags: tags });
                      }}
                    >
                      {tag}
                    </SelectedTag>
                  ))}
                  {this.state.tags.length === 0 && (
                    <PlaceholderText>Select Tags Below...</PlaceholderText>
                  )}
                </SelectedTags>
                <Options>
                  {this.props.options
                    .filter(
                      (tag: string) => this.state.tags.indexOf(tag) === -1
                    )
                    .map((tag: string) => (
                      <Option
                        onClick={() => {
                          let tags: string[] = this.state.tags;
                          tags.push(tag);
                          this.setState({ tags: tags });
                        }}
                      >
                        {tag}
                      </Option>
                    ))}
                </Options>
              </PopupContent>
            }
            showButton={true}
            closePopup={() => this.setState({ popupOpen: false })}
            submitPopup={() => this.props.setTags(this.state.tags)}
          ></Popup>
        )}
      </StyledAddTags>
    );
  }
}
