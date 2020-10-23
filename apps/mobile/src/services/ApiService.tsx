import { useDispatch } from "react-redux";
import { firebaseApp } from "../components/shared/Login";
import { setToken } from "../state/userSlice";

const ApiService = async (route: string, requestOptions: any) => {
  const dispatch = useDispatch();
  try {
    const response = await fetch(route, requestOptions);
    if (!response.ok) {
      const newToken = await firebaseApp.auth().currentUser!.getIdToken(true);
      dispatch(setToken(newToken));
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
