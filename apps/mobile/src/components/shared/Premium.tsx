import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { hidePremium, selectPremium } from "../../state/navigationSlice";
import ExitBar from "./ExitBar";
import natureOnScren from "../../assets/svgs/NatureOnScreen.svg";
import PremiumFeature from "./PremiumFeature";

import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import CasinoIcon from "@material-ui/icons/Casino";
import { Button } from "../../styles/Shared";

const StyledPremium = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  justify-content: space-between;
  overflow: auto;
`;

const Header = styled.div`
  width: 100%;
  font-size: 27px;
  color: var(--main);
  text-align: center;
  line-height: 1.2;
`;

const Features = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Premium = () => {
  const dispatch = useDispatch();
  const premium = useSelector(selectPremium);
  if (!premium) return null;
  return (
    <StyledPremium>
      <ExitBar exit={() => dispatch(hidePremium())} />
      <Header>100% of Profits go to Support Mental Health</Header>
      <img src={natureOnScren} alt="Premium Illustration" width="80%" />
      <Features>
        <PremiumFeature
          header={"Unlimited Tags"}
          description={
            "Create unlimited tags to track your mood for all aspects of your life"
          }
          icon={<LocalOfferIcon />}
        />
        <PremiumFeature
          header={"Unlimited Moods"}
          description={
            "Create as many moods as you like each day for detailed tracking and reporting"
          }
          icon={<EmojiEmotionsIcon />}
        />
        {/* <PremiumFeature
          header={"Random Reminders"}
          description={
            "Create reminders with a random range to capture your mood at any and all times"
          }
          icon={<CasinoIcon />}
        /> */}
      </Features>
      <Button> Get Premium for $4.99/month</Button>
    </StyledPremium>
  );
};

export default Premium;
