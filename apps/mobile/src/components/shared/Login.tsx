import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { initApp, selectLoggingIn } from "../../state/navigationSlice";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { updateData } from "../../state/dataSlice";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import {
  selectUser,
  setId,
  setIsAnonymous,
  setToken,
} from "../../state/userSlice";
import { updateSettings, setTimezone } from "../../state/settingsSlice";
const { Storage } = CapacitorPlugins;

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

export const firebaseApp = firebase.initializeApp(firebaseConfig);

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

const Login = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(selectLoggingIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(initApp);

    firebaseApp.auth().onAuthStateChanged(async (changedUser) => {
      if (!changedUser) return;
      const userToken = await changedUser.getIdToken(true);
      dispatch(setToken(userToken));
      dispatch(setId(changedUser.uid));
      dispatch(setIsAnonymous(changedUser.isAnonymous));
      dispatch(updateData());
      dispatch(updateSettings(userToken));
      dispatch(setTimezone());
    });

    firebaseApp.auth().onIdTokenChanged(async (changedUser) => {
      if (!changedUser) return;
      let userToken = await changedUser!.getIdToken();
      dispatch(setToken(userToken));
    });

    Storage.get({ key: "logged" }).then((result: any) => {
      let ret: { value: any } = result;
      if (!ret.value) {
        firebase
          .auth()
          .signInAnonymously()
          .catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggingIn || (user && !user.isAnonymous)) return null;

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
