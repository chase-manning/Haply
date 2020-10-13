import {
  configureStore,
  ThunkAction,
  Action,
  createStore,
  applyMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";
import userReducer from "./userSlice";
import settingsReducer from "./settingsSlice";
import tempReducer from "./tempSlice";
import dataReducer from "./dataSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

import thunk from "redux-thunk";

const sagaMiddleware = createSagaMiddleware();

export const reducer = combineReducers({
  navigation: navigationReducer,
  user: userReducer,
  settings: settingsReducer,
  temp: tempReducer,
  data: dataReducer,
});

export const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware, thunk)
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
