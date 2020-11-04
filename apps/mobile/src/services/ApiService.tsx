import { firebaseApp } from "../components/shared/Login";

const ApiService = async (
  route: string,
  userToken: string,
  method: string,
  body?: any
) => {
  try {
    const requestOptions = RequestOptions(userToken, method, body);
    const response = await fetch(route, requestOptions);
    if (!response.ok && response.status === 403) {
      const newToken = await firebaseApp.auth().currentUser!.getIdToken(true);
      const newRequestOptions = RequestOptions(newToken, method, body);
      return await fetch(route, newRequestOptions);
    }
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
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
