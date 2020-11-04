import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectError, hideError } from "../../state/navigationSlice";
import Popup from "./Popup";
import cancelSvg from "../../assets/svgs/Cancel.svg";

const PopupContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Svg = styled.img`
  width: 80%;
`;

const Title = styled.div`
  text-align: center;
  width: 100%;
  font-size: 16px;
  color: var(--main);
  margin-top: 30px;
`;

const Description = styled.div`
  font-size: 12px;
  margin: 10px 0 12px 0;
  color: var(--sub);
  width: 70%;
  text-align: center;
  line-height: 1.5;
`;

const Error = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  if (error === "") return;

  return (
    <Popup
      open={error !== ""}
      content={
        <PopupContent>
          <Svg src={cancelSvg}></Svg>
          <Title>Error</Title>
          <Description>{error}</Description>
        </PopupContent>
      }
      close={() => dispatch(hideError())}
      showButton={true}
    />
  );
};

export default Error;
