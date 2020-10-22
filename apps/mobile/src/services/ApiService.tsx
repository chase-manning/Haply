import { firebaseApp } from "../components/shared/Login";

const ApiService = async (route: string, requestOptions: any) => {
  try {
    const response = await fetch(route, requestOptions);
    if (!response.ok) {
      const newToken = await firebaseApp.auth().currentUser!.getIdToken();
      requestOptions.headers.Authorization = "Bearer " + newToken;
      return await fetch(route, requestOptions);
    }
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default ApiService;
