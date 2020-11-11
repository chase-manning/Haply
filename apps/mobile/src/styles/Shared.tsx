import styled from "styled-components";

type CardProps = {
  highlight?: boolean;
  height?: string;
};

export const Card = styled.div`
  width: 100%;
  height: ${(props: CardProps) => (props.height ? props.height : "auto")};
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  background-color: ${(props: CardProps) =>
    props.highlight ? "var(--primary)" : "var(--bg-mid)"};
  box-shadow: var(--shadow);
  transition: all 0.2s ease-out;

  &:active:hover {
    transform: scale(0.99);
    box-shadow: var(--shadow-clicked);
  }
`;

export const Header = styled.div`
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  color: var(--main);
`;

type IconProps = {
  secondary?: boolean;
  highlight?: boolean;
  noData?: boolean;
};

export const Icon = styled.div`
  width: 35px;
  height: 35px;
  background-color: ${(props: IconProps) => {
    if (props.secondary) return "var(--highlight-light)";
    else if (props.highlight) return "var(--highlight)";
    else if (props.noData) return "var(--sub-light)";
    else return "var(--primary-light)";
  }};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props: IconProps) => {
    if (props.secondary) return "var(--highlight)";
    else if (props.highlight) return "var(--bg-mid)";
    else if (props.noData) return "var(--sub)";
    else return "var(--primary)";
  }};
  border: ${(props: IconProps) => {
    if (props.secondary) return "none";
    else if (props.highlight) return "none";
    else if (props.noData) return "dashed 1px var(--sub)";
    else return "none";
  }};
`;

type SeletedTagProps = {
  includeMargin: boolean;
  hightlightColor?: boolean;
};

export const SelectedTag = styled.button`
  padding: 5px 8px;
  border-radius: 12px;
  background-color: ${(props: SeletedTagProps) =>
    props.hightlightColor ? "var(--highlight-light)" : "var(--primary-light)"};
  font-size: 12px;
  margin: ${(props: SeletedTagProps) => {
    return props.includeMargin ? "0 5px 5px 0" : "0 5px 0 0";
  }};
  color: ${(props: SeletedTagProps) =>
    props.hightlightColor ? "var(--highlight)" : "var(--primary)"};
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
  max-height: 200px;
  overflow: auto;
`;

export const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bg);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  background-color: var(--primary);
`;
