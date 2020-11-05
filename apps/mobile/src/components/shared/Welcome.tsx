import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  selectShowWelcome,
  showWelcome,
  hideWelcome,
} from "../../state/navigationSlice";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
const { Storage } = CapacitorPlugins;

const StyledWelcome = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--bg-mid);
`;

const Welcome = () => {
  const dispatch = useDispatch();
  const show = useSelector(selectShowWelcome);

  useEffect(() => {
    Storage.get({ key: "welcomed" }).then((result: any) => {
      let ret: { value: any } = result;
      if (ret.value) {
        dispatch(hideWelcome());
      } else {
        dispatch(showWelcome());
      }
    });
  }, []);

  if (!show) return null;

  return <StyledWelcome>Meow</StyledWelcome>;
};

export default Welcome;
