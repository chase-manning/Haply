import { firebaseApp } from "../components/shared/Login";

const ApiService = async (route: string, requestOptions: any) => {
  try {
    if (requestOptions.headers.Authorization.lenth < 10) {
      const newToken = await getUpdatedToken();
      requestOptions.headers.Authorization = "Bearer " + newToken;
    }
    return await fetch(route, requestOptions);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUpdatedToken = async (): Promise<string> => {
  return await firebaseApp.auth().currentUser!.getIdToken(true);
};

export default ApiService;
