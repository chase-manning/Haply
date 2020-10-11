import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginShowing } from "../../state/navigationSlice";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { selectUser, setUser } from "../../state/userSlice";
import { User } from "firebase";
import firebase from "firebase/app";
import "firebase/auth";

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

function Login() {
  const dispatch = useDispatch();
  const loginShowing = useSelector(selectLoginShowing);
  const user = useSelector(selectUser);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((changedUser) => {
      if (!changedUser) return;
      dispatch(setUser(changedUser));
    });

    if (!user) {
      firebase
        .auth()
        .signInAnonymously()
        .catch(function (error) {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  });

  if (!loginShowing) return null;

  return (
    <OverlayContainer>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseApp.auth()}
      />
    </OverlayContainer>
  );
}

export default Login;
