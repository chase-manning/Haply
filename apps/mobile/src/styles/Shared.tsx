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
  border: none;
  outline: none;
`;
