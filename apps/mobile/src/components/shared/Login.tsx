import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggingIn } from "../../state/navigationSlice";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { User } from "firebase/app";
import "firebase/auth";
import {
  selectMoods,
  updateAchievements,
  updateMoods,
  updateStats,
} from "../../state/dataSlice";
import { selectColorPrimary, selectMode } from "../../state/tempSlice";

const firebaseConfig = {
  apiKey: "AIzaSyAHtDNHcNnaty3hDN9DKkRVCTLRDVeGC0w",
  authDomain: "happiness-software.firebaseapp.com",
  databaseURL: "https://happiness-software.firebaseio.com",
  projectId: "happiness-software",
  storageBucket: "happiness-software.appspot.com",
  messagingSenderId: "293873304513",
  appId: "1:293873304513:web:49a1114e1603ed6978e540",
  measurementId: "G-0KC720H0FM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const OverlayContainer = styled.div`
  background-color: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

type Props = {
  user?: User;
  setUser: (user: User) => void;
};

const Login = (props: Props) => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(selectLoggingIn);
  const moods = useSelector(selectMoods);
  const colorPrimary = useSelector(selectColorPrimary);
  const mode = useSelector(selectMode);

  useEffect(() => {
    if (!props.user) {
      firebase
        .auth()
        .signInAnonymously()
        .catch(function (error) {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }

    firebaseApp.auth().onAuthStateChanged(async (changedUser) => {
      if (!changedUser) return;
      props.setUser(changedUser);
      dispatch(updateMoods(changedUser));
      dispatch(updateAchievements(moods, colorPrimary, mode));
      dispatch(updateStats(moods));
    });
  }, [dispatch]);

  if (!loggingIn && (!props.user || props.user?.isAnonymous)) return null;

  return (
    <OverlayContainer>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseApp.auth()}
      />
    </OverlayContainer>
  );
};

export default Login;
