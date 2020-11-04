import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggingIn, hideLogin } from "../../state/navigationSlice";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { updateAll } from "../../state/loadingSlice";
import { Plugins as CapacitorPlugins } from "@capacitor/core";
import {
  selectUser,
  setId,
  setIsAnonymous,
  setToken,
} from "../../state/userSlice";
import ExitBar from "./ExitBar";
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
  background-color: var(--bg-mid);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
`;

const LoginHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--main);
  font-size: 40px;
  text-align: center;
`;

const Login = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(selectLoggingIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (changedUser) => {
      if (!changedUser) return;
      const userToken = await changedUser.getIdToken(true);
      dispatch(setToken(userToken));
      dispatch(setId(changedUser.uid));
      dispatch(setIsAnonymous(changedUser.isAnonymous));
      dispatch(updateAll());
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
      <ExitBar exit={() => dispatch(hideLogin())} />
      <LoginHeader>Login to Enable Cloud Sync</LoginHeader>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseApp.auth()}
      />
      <div />
    </OverlayContainer>
  );
};

export default Login;
