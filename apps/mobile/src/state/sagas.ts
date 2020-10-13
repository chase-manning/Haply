import { put, takeEvery, all } from "redux-saga/effects";
import { toggleRandomReminders, toggleRemindersEnabled } from "./settingsSlice";

function* helloSaga() {
  console.log("Hello Sagas!");
}

function* incrementAsync() {
  yield put(toggleRandomReminders());
  console.log("test");
}

function* watchIncrementAsync() {
  yield takeEvery(toggleRemindersEnabled, incrementAsync);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
