import { firebaseApp } from "../components/shared/Login";
import { store } from "../state/store";
import { selectToken } from "../state/userSlice";

const API_URL = "https://us-central1-happiness-software.cloudfunctions.net/";

const ApiService = async (route: string, method: string, body?: any) => {
  const fullRoute = route + API_URL;
  const userToken = selectToken(store.getState());
  const requestOptions = RequestOptions(userToken, method, body);
  const response = await fetch(fullRoute, requestOptions);
  if (!response.ok && response.status === 403) {
    const newToken = await firebaseApp.auth().currentUser!.getIdToken(true);
    const newRequestOptions = RequestOptions(newToken, method, body);
    return await fetch(fullRoute, newRequestOptions);
  }
  return await response.json();
};

const RequestOptions = (userToken: string, method: string, body?: any): any => {
  if (body) {
    return {
      method: method,
      body: body,
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
    };
  }
  return {
    method: method,
    headers: {
      Authorization: "Bearer " + userToken,
    },
  };
};

export default ApiService;
