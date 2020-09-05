import React, { Component } from "react";
import styled from "styled-components";
import PersonOutline from "@material-ui/icons/PersonOutline";
import WhatshotOutlined from "@material-ui/icons/WhatshotOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledProfile = styled.div`
  width: 100%;
  height: 100%;
`;

const Card = styled.div`
  width: 100%;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
  align-items: center;
  margin-bottom: 20px;
`;

const Photo = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 20px;
  position: relative;
`;

const HappinessScale = styled.div`
  position: absolute;
  top: -13px;
  left: -13px;
`;

const Name = styled.div`
  color: black;
  font-size: 20px;
`;

const Description = styled.div`
  color: var(--sub);
  font-size: 14px;
  margin-top: 5px;
`;

const StatusContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  width: 150px;
`;

const Status = styled.div`
  border-radius: 14px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 7px 14px;
  font-size: 14px;
  color: var(--sub);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.07);
`;

const StatusNumber = styled.div`
  color: var(--primary);
  margin-left: 5px;
`;

const Header = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
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

export default class Profile extends Component {
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
        <Card>
          <Photo>
            <HappinessScale>
              <CircularProgress
                value={80}
                variant="static"
                size="176px"
                thickness={1.5}
                style={{ color: "var(--primary)", strokeLinecap: "round" }}
              />
            </HappinessScale>
            <PersonOutline style={{ transform: "scale(4)" }} />
          </Photo>
          {false && <Name>Chase Manning</Name>}
          {false && <Description>Apprentice</Description>}
          <StatusContainer>
            <Status>
              <WhatshotOutlined fontSize="inherit" />
              <StatusNumber>33</StatusNumber>
            </Status>
          </StatusContainer>
        </Card>
        {false && (
          <Card>
            <Header>Acheivements</Header>
            <Acheivements>{acheivements}</Acheivements>
          </Card>
        )}
      </StyledProfile>
    );
  }
}
