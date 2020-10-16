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
  addTagOption,
  removeTagOption,
  selectColorPrimary,
  selectMode,
  setColorPrimary,
  toggleMode,
} from "./settingsSlice";
import { completeAppInit, initApp } from "./navigationSlice";
import Mood from "../models/mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "../models/AchievementModel";
import {
  selectPushNotificationToken,
  selectUser,
  setPushNotificationToken,
  setUser,
} from "./userSlice";
import PushNotificationService from "../services/PushNotificationService";
import { User } from "firebase";
import SettingService from "../services/SettingService";
const { Storage } = CapacitorPlugins;

/* WATCHERS */
function* watchAppInit() {
  yield takeEvery(initApp, initialiseApp);
}

function* watchSetUser() {
  yield takeEvery(setUser, function* processSetUser() {
    yield call(saveUser);
    yield call(savePushNotificationToken);
  });
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

function* watchAddTag() {
  yield takeEvery(addTagOption, saveSettings);
}

function* watchRemoveTag() {
  yield takeEvery(removeTagOption, saveSettings);
}

function* watchSetColorPrimary() {
  yield takeEvery(setColorPrimary, saveSettings);
}

function* watchToggleMode() {
  yield takeEvery(toggleMode, saveSettings);
}

function* watchSetPushNotificationToken() {
  yield takeEvery(setPushNotificationToken, savePushNotificationToken);
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

function* saveUser() {
  let user: User = yield select(selectUser);
  Storage.set({ key: "user", value: JSON.stringify(user) });
}

function* savePushNotificationToken() {
  const user = yield select(selectUser);
  const pushNotificationToken = yield select(selectPushNotificationToken);
  if (user && pushNotificationToken)
    PushNotificationService.updateToken(user, pushNotificationToken);
}

function* saveSettings() {
  let settings: SettingsState = yield select(selectSettings);
  Storage.set({ key: "settings", value: JSON.stringify(settings) });
  const user = yield select(selectUser);
  SettingService.createSetting(user, settings);
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
    watchSetUser(),
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
    watchAddTag(),
    watchRemoveTag(),
    watchSetColorPrimary(),
    watchToggleMode(),
    watchSetPushNotificationToken(),
  ]);
}
