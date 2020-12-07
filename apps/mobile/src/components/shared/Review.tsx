import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectMoods } from "../../state/dataSlice";
import Popup from "./Popup";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import likeDislike from "../../assets/svgs/LikeDislike.svg";
import feedback from "../../assets/svgs/Feedback.svg";
import designFeedback from "../../assets/svgs/DesignFeedback.svg";
import { selectIsAndroid } from "../../state/navigationSlice";

const { Storage } = CapacitorPlugins;

const StyledReview = styled.div``;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const PopupHeader = styled.div`
  color: var(--main);
  font-size: 18px;
  padding-top: 30px;
  margin-bottom: 6px;
  border-top: solid 1px var(--sub);
  text-align: center;
`;

const Svg = styled.img`
  width: 70%;
`;

enum ReviewStatus {
  Unknown,
  Happy,
  Sad,
}

const Review = () => {
  const moods = useSelector(selectMoods);
  const isAndroid = useSelector(selectIsAndroid);
  const [reviewed, setReviewed] = useState(true);
  const [reviewStatus, setReviewStatus] = useState(ReviewStatus.Unknown);

  useEffect(() => {
    Storage.get({ key: "reviewed" }).then((result: any) => {
      let ret: { value: any } = result;
      setReviewed(ret.value || false);
    });
  }, []);

  if (moods.length === 0) return null;

  const isHappy = moods[0].value >= 8;

  let date = new Date();
  const startDate = new Date(date.setDate(date.getDate() - 2));
  const firstDate = moods[moods.length - 1].date;
  const hasUsed = moods.length >= 6 || firstDate < startDate;

  const showPopup = isHappy && hasUsed && !reviewed;

  const reviewComplete = () => {
    Storage.set({ key: "reviewed", value: "false" });
    setReviewed(true);
  };

  const openReview = () => {
    if (isAndroid)
      window.open("https://play.google.com/store/apps/details?id=haply.app");
    else window.open("https://apps.apple.com/us/app/id1530768759");
  };

  if (!showPopup) return null;

  return (
    <StyledReview>
      <Popup
        open={reviewStatus === ReviewStatus.Unknown}
        content={
          <PopupContent>
            <Svg src={likeDislike} />
            <PopupHeader>Are you enjoying Haply?</PopupHeader>
          </PopupContent>
        }
        close={() => {
          reviewComplete();
          setReviewStatus(ReviewStatus.Happy);
        }}
        showButton={true}
        showCancelButton={true}
        buttonText={"Yes!"}
        cancelButtonText={"Nah"}
        submit={() => setReviewStatus(ReviewStatus.Happy)}
        cancel={() => setReviewStatus(ReviewStatus.Sad)}
      />
      <Popup
        open={reviewStatus === ReviewStatus.Happy}
        content={
          <PopupContent>
            <Svg src={feedback} />
            <PopupHeader>Happy to give us a Review?</PopupHeader>
          </PopupContent>
        }
        close={() => reviewComplete()}
        showButton={true}
        buttonText={"Absolutely!"}
        submit={() => openReview()}
      />
      <Popup
        open={reviewStatus === ReviewStatus.Sad}
        content={
          <PopupContent>
            <Svg src={designFeedback} />
            <PopupHeader>How could we improve?</PopupHeader>
          </PopupContent>
        }
        close={() => reviewComplete()}
        showButton={true}
        buttonText={"Give Feedback"}
        submit={() =>
          window.open("mailto:hello@haply.app?subject=Haply Feedback")
        }
      />
    </StyledReview>
  );
};

export default Review;
