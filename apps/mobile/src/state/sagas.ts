import { put, takeEvery, all, select, call } from "redux-saga/effects";
import AchievementService from "../services/AchievementService";
import StatService from "../services/StatService";
import {
  addMood,
  removeMood,
  selectAchievements,
  selectMoods,
  selectStats,
  setAchievements,
  setMoods,
  setStats,
} from "./dataSlice";
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
import Mood from "../models/mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "../models/AchievementModel";
const { Storage } = CapacitorPlugins;

/* WATCHERS */
function* watchAppInit() {
  yield takeEvery(initApp, initialiseApp);
}

function* watchSetMoods() {
  yield takeEvery(setMoods, function* processSetMood() {
    yield call(softUpdate);
    yield call(saveMoods);
  });
}

function* watchSetStats() {
  yield takeEvery(setStats, saveStats);
}

function* watchSetAchievements() {
  yield takeEvery(setAchievements, saveAchievements);
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

function* watchAddMood() {
  yield takeEvery(addMood, softUpdate);
}

function* watchRemoveMood() {
  yield takeEvery(removeMood, softUpdate);
}

/* ACTIONS */
function* initialiseApp() {
  yield call(loadSettings);
  yield call(loadMoods);
  yield call(loadStats);
  yield call(loadAchievements);
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

function* saveSettings() {
  let settings: SettingsState = yield select(selectSettings);
  Storage.set({ key: "settings", value: JSON.stringify(settings) });
}

function* saveMoods() {
  let moods: Mood[] = yield select(selectMoods);
  Storage.set({ key: "moods", value: JSON.stringify(moods) });
}

function* saveStats() {
  let stats: StatModel[] = yield select(selectStats);
  Storage.set({ key: "stats", value: JSON.stringify(stats) });
}

function* saveAchievements() {
  let achievments: AchievementModel[] = yield select(selectAchievements);
  Storage.set({ key: "achievements", value: JSON.stringify(achievments) });
}

function* loadSettings() {
  let ret: { value: any } = yield Storage.get({ key: "settings" });
  if (ret.value) {
    let settings: SettingsState = JSON.parse(ret.value);
    yield put(setSettings(settings));
  }
}

function* loadMoods() {
  let ret: { value: any } = yield Storage.get({ key: "moods" });
  if (ret.value) {
    let moods: Mood[] = JSON.parse(ret.value);
    yield put(setMoods(moods));
  }
}

function* loadStats() {
  let ret: { value: any } = yield Storage.get({ key: "stats" });
  if (ret.value) {
    let stats: StatModel[] = JSON.parse(ret.value);
    yield put(setStats(stats));
  }
}

function* loadAchievements() {
  let ret: { value: any } = yield Storage.get({ key: "achievements" });
  if (ret.value) {
    let achievements: AchievementModel[] = JSON.parse(ret.value);
    yield put(setAchievements(achievements));
  }
}

export default function* rootSaga() {
  yield all([
    watchAppInit(),
    watchSetMoods(),
    watchSetStats(),
    watchSetAchievements(),
    watchToggleRemindersEnabled(),
    watchToggleRandomReminders(),
    watchSetFrequencyMinutesMin(),
    watchSetFrequencyMinutesMax(),
    watchUpdateNextNotification(),
    watchAddMood(),
    watchRemoveMood(),
  ]);
}
