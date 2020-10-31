import {
  ThunkAction,
  Action,
  createStore,
  applyMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";
import userReducer from "./userSlice";
import settingsReducer from "./settingsSlice";
import dataReducer from "./dataSlice";
import premiumReducer from "./premiumSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const sagaMiddleware = createSagaMiddleware();

export const reducer = combineReducers({
  navigation: navigationReducer,
  user: userReducer,
  settings: settingsReducer,
  data: dataReducer,
  premium: premiumReducer,
});

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware, thunk))
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
