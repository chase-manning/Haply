import { put, takeEvery, all, select, call } from "redux-saga/effects";
import AchievementService from "../services/AchievementService";
import StatService from "../services/StatService";
import { selectMoods, setAchievements, setMoods, setStats } from "./dataSlice";
import { selectColorPrimary, selectMode } from "./tempSlice";

import { Plugins as CapacitorPlugins } from "@capacitor/core";
import {
  SettingsState,
  setSettings,
  selectSettings,
  toggleRemindersEnabled,
  toggleRandomReminders,
  setFrequencyMinutesMin,
  setFrequencyMinutesMax,
  updateNextNotification,
} from "./settingsSlice";
import { completeAppInit, initApp } from "./navigationSlice";
const { Storage } = CapacitorPlugins;

/* WATCHERS */
function* watchAppInit() {
  yield takeEvery(initApp, initialiseApp);
}

function* watchSetMoods() {
  yield takeEvery(setMoods, softUpdate);
}

function* watchToggleRemindersEnabled() {
  yield takeEvery(toggleRemindersEnabled, saveSettings);
}

function* watchToggleRandomReminders() {
  yield takeEvery(toggleRandomReminders, saveSettings);
}

function* watchSetFrequencyMinutesMin() {
  yield takeEvery(setFrequencyMinutesMin, saveSettings);
}

function* watchSetFrequencyMinutesMax() {
  yield takeEvery(setFrequencyMinutesMax, saveSettings);
}

function* watchUpdateNextNotification() {
  yield takeEvery(updateNextNotification, saveSettings);
}

/* ACTIONS */
function* initialiseApp() {
  yield call(loadSettings);
  yield put(completeAppInit());
}

function* softUpdate() {
  const moods = yield select(selectMoods);
  const stats = StatService.getStats(moods);
  yield put(setStats(stats));

  const colorPrimary = yield select(selectColorPrimary);
  const mode = yield select(selectMode);
  const achievements = AchievementService.getAchievements(
    moods,
    colorPrimary,
    mode
  );

  yield put(setAchievements(achievements));
}

function* loadSettings() {
  let ret: { value: any } = yield Storage.get({ key: "settings" });
  if (ret.value) {
    let settings: SettingsState = JSON.parse(ret.value);
    yield put(setSettings(settings));
  }
}

function* saveSettings() {
  let settings: SettingsState = yield select(selectSettings);
  Storage.set({ key: "settings", value: JSON.stringify(settings) });
}

export default function* rootSaga() {
  yield all([
    watchAppInit(),
    watchSetMoods(),
    watchToggleRemindersEnabled(),
    watchToggleRandomReminders(),
    watchSetFrequencyMinutesMin(),
    watchSetFrequencyMinutesMax(),
    watchUpdateNextNotification(),
  ]);
}
