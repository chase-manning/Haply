import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectMoods } from "../../state/dataSlice";
import Popup from "./Popup";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
const { Storage } = CapacitorPlugins;

const StyledReview = styled.div``;

enum ReviewStatus {
  Unknown,
  Happy,
  Sad,
}

const Review = () => {
  const moods = useSelector(selectMoods);
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

  const reviewComplete = () => Storage.set({ key: "reviewed", value: "false" });

  if (!showPopup) return null;

  return (
    <StyledReview>
      <Popup
        open={reviewStatus === ReviewStatus.Unknown}
        content={<p>Are you enjoying Haply?</p>}
        close={() => reviewComplete()}
        showButton={true}
        showCancelButton={true}
        buttonText={"Yes!"}
        cancelButtonText={"Nah"}
        submit={() => setReviewStatus(ReviewStatus.Happy)}
        cancel={() => setReviewStatus(ReviewStatus.Sad)}
      />
    </StyledReview>
  );
};

export default Review;
