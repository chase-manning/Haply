import React, { Component } from "react";
import styled from "styled-components";
import MoodService from "../../services/MoodService";
import { User } from "firebase";

const StyledProfile = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
`;

const Acheivements = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
`;

type AcheivementProps = {
  isActive: boolean;
};

const Acheivement = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  align-items: center;
  padding: 10px;
  color: ${(props: AcheivementProps) => {
    return props.isActive ? "var(--primary)" : "var(--sub)";
  }};
`;

const AcheivementIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  margin-bottom: 5px;
`;

const AcheivementName = styled.div`
  color: var(--sub);
  font-size: 12px;
  text-align: center;
`;

class ProfileState {}

type Props = {
  user: User;
};

export default class Profile extends Component<Props> {
  state: ProfileState;

  constructor(props: any) {
    super(props);
    this.state = new ProfileState();
  }

  componentDidMount() {
    this.setAverageHappiness();
  }

  render() {
    let acheivements: any = [];

    let i = 0;
    while (i < 40) {
      acheivements.push(
        <Acheivement isActive={true}>
          <AcheivementIcon></AcheivementIcon>
          <AcheivementName>Meow</AcheivementName>
        </Acheivement>
      );
      i++;
    }

    return (
      <StyledProfile data-testid="Profile">
        <Acheivements>{acheivements}</Acheivements>
      </StyledProfile>
    );
  }
  async setAverageHappiness(): Promise<void> {
    const averageHappiness: number = await MoodService.averageMood(
      this.props.user.uid
    );
    this.setState({ averageHappiness: averageHappiness * 10 });
  }

  async setDailyStreak(): Promise<void> {
    if (!this.props.user) {
      setTimeout(() => {
        this.setDailyStreak();
      }, 500);
      return;
    }
  }
}
