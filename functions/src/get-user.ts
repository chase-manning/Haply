import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const firebase = admin.initializeApp(functions.config().firebase, "getUser");

export async function getUser(
  req: any
): Promise<admin.auth.DecodedIdToken | null> {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    return null;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    idToken = req.cookies.__session;
  } else {
    return null;
  }

  try {
    const user = await firebase.auth().verifyIdToken(idToken);
    return user;
  } catch (error) {
    return null;
  }
}
