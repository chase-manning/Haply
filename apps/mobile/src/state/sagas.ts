import { put, takeEvery, all, select } from "redux-saga/effects";
import AchievementService from "../services/AchievementService";
import StatService from "../services/StatService";
import { selectMoods, setAchievements, setMoods, setStats } from "./dataSlice";
import { selectColorPrimary, selectMode } from "./tempSlice";

/* WATCHERS */
function* watchSetMoods() {
  yield takeEvery(setMoods, softUpdate);
}

/* ACTIONS */
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

export default function* rootSaga() {
  yield all([watchSetMoods()]);
}
