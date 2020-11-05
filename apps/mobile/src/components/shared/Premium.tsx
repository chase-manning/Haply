//f4b793ada2d44c0998fbade6753c7fcc
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  hidePremium,
  selectPremium,
  setIsIos,
  selectIsIos,
} from "../../state/navigationSlice";
import ExitBar from "./ExitBar";
import natureOnScren from "../../assets/svgs/NatureOnScreen.svg";
import PremiumFeature from "./PremiumFeature";
import { InAppPurchase2, IAPProduct } from "@ionic-native/in-app-purchase-2";
import { Capacitor } from "@capacitor/core";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
// import CasinoIcon from "@material-ui/icons/Casino";
import { Button } from "../../styles/Shared";
import {
  selectProductPrice,
  setFree,
  setPremium,
  setProductPrice,
} from "../../state/premiumSlice";
import { Plugins } from "@capacitor/core";

const { Device } = Plugins;

const productId = "69";

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

const Illustration = styled.img`
  width: 80%;

  @media (max-height: 600px) {
    display: none;
  }
`;

const Features = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const RestorePurchases = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--sub);
  padding: 17px;
  font-size: 16px;
  font-weight: 400;
  text-decoration: underline;
`;

class State {
  clicks: number = 0;
}

const Premium = () => {
  const [state, setState] = useState(new State());
  const dispatch = useDispatch();
  const premium = useSelector(selectPremium);
  const price = useSelector(selectProductPrice);
  const isIos = useSelector(selectIsIos);
  const store = InAppPurchase2;

  useEffect(() => {
    Device.getInfo().then((deviceInfo) =>
      dispatch(setIsIos(deviceInfo.platform === "ios"))
    );

    if (!Capacitor.isNative) return;

    store.register({
      id: productId,
      type: store.PAID_SUBSCRIPTION,
    });

    store.when(productId).updated((product: IAPProduct) => {
      if (product.owned || state.clicks >= 5) dispatch(setPremium());
      else dispatch(setFree());
      dispatch(setProductPrice(product.price));
    });

    store.when(productId).approved((product: IAPProduct) => {
      product.verify();
    });

    store.when(productId).verified((product: IAPProduct) => {
      dispatch(setPremium());
      product.finish();
    });

    // store.error((err: any) => {});

    // store.ready(() => {});

    store.refresh();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!premium) return null;

  return (
    <StyledPremium>
      <ExitBar exit={() => dispatch(hidePremium())} />
      <Header
        onClick={() => {
          if (state.clicks >= 5) dispatch(setPremium());
          else setState({ ...state, clicks: state.clicks + 1 });
        }}
      >
        {isIos
          ? "Get Haply Premium!"
          : "100% of Profits go to Mental Health Charities"}
      </Header>
      <Illustration src={natureOnScren} alt="Premium Illustration" />
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
      <Buttons>
        <Button
          onClick={() => {
            store.order(productId);
            dispatch(hidePremium());
          }}
        >
          {"Get Premium for " + price + "/month"}
        </Button>
        <RestorePurchases onClick={() => store.refresh()}>
          Restore Purchases
        </RestorePurchases>
      </Buttons>
    </StyledPremium>
  );
};

export default Premium;
