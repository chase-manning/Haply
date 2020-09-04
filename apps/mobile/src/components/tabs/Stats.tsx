import React, { Component } from "react";
import styled from "styled-components";
import Stat from "../shared/Stat";
import AnalyticsService, { Day } from "../../services/AnalyticsService";
import { CircularProgress } from "@material-ui/core";
import { User } from "firebase";

const StyledStats = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class StatsState {
  days: Day[] = [];
}

type Props = {
  user: User;
};

export default class Stats extends Component<Props> {
  state: StatsState;

  constructor(props: any) {
    super(props);
    this.state = new StatsState();
  }

  componentDidMount() {
    this.getDays();
  }

  render() {
    const days: Day[] = this.state.days;

    const content =
      days.length === 0 ? (
        <CircularProgress style={{ color: "var(--primary)" }} />
      ) : (
        <Stat days={days} />
      );

    return <StyledStats data-testid="Stats">{content}</StyledStats>;
  }

  async getDays(): Promise<void> {
    const days: Day[] = await AnalyticsService.getDailyMoods(
      this.props.user.uid
    );
    this.setState({ days: days });
  }
}
