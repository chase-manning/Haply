import { put, takeEvery, all, select, call } from "redux-saga/effects";
import AchievementService from "../services/AchievementService";
import StatService from "../services/StatService";
import {
  selectAchievements,
  selectStats,
  setAchievements,
  setMoods,
  setStats,
} from "./dataSlice";
import {
  completeAchievements,
  completeInitialisation,
  completeMoods,
  completeSettings,
  completeStats,
  updateAchievements,
  updateAll,
  updateMoods,
  updateSettings,
  updateStats,
} from "./loadingSlice";
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
function* watchUpdateAll() {
  yield takeEvery(updateAll, runUpdateAll);
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

function* watchUpdateSettings() {
  yield takeEvery(updateSettings, runUpdateSettings);
}

function* watchSetToken() {
  yield takeEvery(setToken, function* processSetUser() {
    yield call(saveUser);
    yield call(savePushNotificationToken);
  });
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
  yield takeEvery(addTagOption, function* processAddTag() {
    yield call(saveSettings);
    const achievements: AchievementModel[] = yield select(selectAchievements);
    const complete = achievements.some(
      (achievement: AchievementModel) =>
        achievement.title === "Tag Tinkerer" &&
        achievement.percentComplete === 1
    );
    if (!complete) yield put(updateAchievements());
  });
}

function* watchRemoveTag() {
  yield takeEvery(removeTagOption, saveSettings);
}

function* watchSetColorPrimary() {
  yield takeEvery(setColorPrimary, function* processSetColorPrimary() {
    yield call(saveSettings);
    const achievements: AchievementModel[] = yield select(selectAchievements);
    const complete = achievements.some(
      (achievement: AchievementModel) =>
        achievement.title === "Looking Stylish" &&
        achievement.percentComplete === 1
    );
    if (!complete) yield put(updateAchievements());
  });
}

function* watchToggleMode() {
  yield takeEvery(toggleMode, function* processSetColorPrimary() {
    yield call(saveSettings);
    yield call(setStatusBar);
    const achievements: AchievementModel[] = yield select(selectAchievements);
    const complete = achievements.some(
      (achievement: AchievementModel) =>
        achievement.title === "Full Moon" && achievement.percentComplete === 1
    );
    if (!complete) yield put(updateAchievements());
  });
}

function* watchSetTimezone() {
  yield takeEvery(setTimezone, saveSettings);
}

function* watchSetPushNotificationToken() {
  yield takeEvery(setPushNotificationToken, savePushNotificationToken);
}

/* ACTIONS */
function* runUpdateAll() {
  yield all([
    call(runUpdateMoods),
    call(runUpdateStats),
    call(runUpdateAchievements),
    call(runUpdateSettings),
  ]);
  yield put(completeInitialisation());
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

function* runUpdateSettings() {
  const userToken = yield select(selectToken);
  const setting = yield SettingService.getSetting(userToken);
  if (setting) yield put(setSettings(setting));

  // Update Timezone if Different
  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone && timezone.length > 1) {
    if (setting && setting.timezone !== timezone) yield put(setTimezone());
  }
  yield put(completeSettings());
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
  const userToken = yield select(selectToken);
  SettingService.createSetting(userToken, settings);
}

export default function* rootSaga() {
  yield all([
    watchUpdateAll(),
    watchUpdateMoods(),
    watchUpdateStats(),
    watchUpdateAchievements(),
    watchUpdateSettings(),
    watchSetToken(),
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
