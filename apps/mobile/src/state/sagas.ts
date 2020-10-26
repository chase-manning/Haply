import { put, takeEvery, all, select, call } from "redux-saga/effects";
import AchievementService from "../services/AchievementService";
import StatService from "../services/StatService";
import {
  completeAchievements,
  completeMoods,
  completeStats,
  selectAchievements,
  selectMoods,
  selectStats,
  setAchievements,
  setMoods,
  setStats,
  updateAchievements,
  updateData,
  updateMoods,
  updateStats,
} from "./dataSlice";
import {
  Plugins as CapacitorPlugins,
  StatusBarStyle,
  Capacitor,
} from "@capacitor/core";
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
  selectMode,
  setColorPrimary,
  toggleMode,
  Mode,
  setTimezone,
} from "./settingsSlice";
import { completeAppInit, initApp } from "./navigationSlice";
import Mood from "../models/mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "../models/AchievementModel";
import {
  selectPushNotificationToken,
  selectToken,
  setPushNotificationToken,
  setToken,
} from "./userSlice";
import PushNotificationService from "../services/PushNotificationService";
import SettingService from "../services/SettingService";
import MoodService from "../services/MoodService";

const { Storage } = CapacitorPlugins;
const { StatusBar } = CapacitorPlugins;

const isStatusBarAvailable = Capacitor.isPluginAvailable("StatusBar");

/* WATCHERS */
function* watchAppInit() {
  yield takeEvery(initApp, initialiseApp);
}

function* watchUpdateData() {
  yield takeEvery(updateData, runUpdateData);
}

function* watchUpdateMoods() {
  yield takeEvery(updateMoods, runUpdateMoods);
}

function* watchUpdateStats() {
  yield takeEvery(updateStats, runUpdateStats);
}

function* watchUpdateAchievements() {
  yield takeEvery(updateAchievements, runUpdateAchievements);
}

function* watchSetToken() {
  yield takeEvery(setToken, function* processSetUser() {
    yield call(saveUser);
    yield call(savePushNotificationToken);
  });
}

function* watchSetMoods() {
  yield takeEvery(setMoods, function* processSetMood() {
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

function* watchSetSettings() {
  yield takeEvery(setSettings, setStatusBar);
}

function* watchAddTag() {
  yield takeEvery(addTagOption, saveSettings);
}

function* watchRemoveTag() {
  yield takeEvery(removeTagOption, saveSettings);
}

function* watchSetColorPrimary() {
  yield takeEvery(setColorPrimary, function* processSetColorPrimary() {
    yield call(saveSettings);
  });
}

function* watchToggleMode() {
  yield takeEvery(toggleMode, function* processSetColorPrimary() {
    yield call(saveSettings);
    yield call(runUpdateAchievements);
    yield call(setStatusBar);
  });
}

function* watchSetTimezone() {
  yield takeEvery(setTimezone, saveSettings);
}

function* watchSetPushNotificationToken() {
  yield takeEvery(setPushNotificationToken, savePushNotificationToken);
}

/* ACTIONS */
function* initialiseApp() {
  yield all([
    call(loadSettings),
    call(loadMoods),
    call(loadStats),
    call(loadAchievements),
  ]);
  yield put(completeAppInit());
}

function* runUpdateData() {
  yield all([
    call(runUpdateMoods),
    call(runUpdateStats),
    call(runUpdateAchievements),
  ]);
}

function* runUpdateMoods() {
  const userToken = yield select(selectToken);
  const moods = yield MoodService.getMoods(userToken, "date", 32);
  if (moods) yield put(setMoods(moods));
  yield put(completeMoods());
}

function* runUpdateStats() {
  const userToken = yield select(selectToken);
  const currentStats = yield select(selectStats);
  const stats = yield StatService.getStats(userToken, currentStats);
  if (stats) yield put(setStats(stats));
  yield put(completeStats());
}

function* runUpdateAchievements() {
  const userToken = yield select(selectToken);
  const currentAchievements: AchievementModel[] = yield select(
    selectAchievements
  );
  let newAchievements = yield AchievementService.getAchievements(
    userToken,
    currentAchievements
  );

  if (newAchievements) yield put(setAchievements(newAchievements!));
  yield put(completeAchievements());
}

function* setStatusBar() {
  if (!isStatusBarAvailable) return;
  const mode = yield select(selectMode);
  StatusBar.setStyle({
    style: mode === Mode.Dark ? StatusBarStyle.Dark : StatusBarStyle.Light,
  });
}

function saveUser() {
  let logged: boolean = true;
  Storage.set({ key: "logged", value: JSON.stringify(logged) });
}

function* savePushNotificationToken() {
  const userToken = yield select(selectToken);
  const pushNotificationToken = yield select(selectPushNotificationToken);
  if (userToken !== "" && pushNotificationToken)
    PushNotificationService.updateToken(userToken, pushNotificationToken);
}

function* saveSettings() {
  let settings: SettingsState = yield select(selectSettings);
  Storage.set({ key: "settings", value: JSON.stringify(settings) });
  const userToken = yield select(selectToken);
  SettingService.createSetting(userToken, settings);
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
    watchUpdateData(),
    watchUpdateMoods(),
    watchUpdateStats(),
    watchUpdateAchievements(),
    watchSetToken(),
    watchSetMoods(),
    watchSetStats(),
    watchSetAchievements(),
    watchToggleRemindersEnabled(),
    watchToggleRandomReminders(),
    watchSetFrequencyMinutesMin(),
    watchSetFrequencyMinutesMax(),
    watchUpdateNextNotification(),
    watchSetSettings(),
    watchAddTag(),
    watchRemoveTag(),
    watchSetColorPrimary(),
    watchToggleMode(),
    watchSetPushNotificationToken(),
    watchSetTimezone(),
  ]);
}
