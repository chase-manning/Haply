import styled from "styled-components";

type SeletedTagProps = {
  includeMargin: boolean;
};

export const SelectedTag = styled.button`
  padding: 5px 8px;
  border-radius: 12px;
  background-color: var(--primary-light);
  font-size: 12px;
  margin: ${(props: SeletedTagProps) => {
    return props.includeMargin ? "0 5px 5px 0" : "0;";
  }};
  color: var(--primary);
  display: inline-block;
  text-overflow: ellipsis;
  height: 24px;
`;

export const SelectedTags = styled.div`
  width: 100%;
  border: solid 1px var(--border);
  border-radius: 15px;
  padding: 5px;
  margin-bottom: 10px;
  min-height: 41px;
  background-color: var(--bg-top);
`;
