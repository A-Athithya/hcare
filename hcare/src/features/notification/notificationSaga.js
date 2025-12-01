import { call, put, takeLatest, all } from "redux-saga/effects";
import { getData, postData, putData } from "../../api/client";
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationReadRequest,
  markNotificationReadSuccess,
  markNotificationReadFailure,
  createNotificationRequest,
  createNotificationSuccess,
  createNotificationFailure,
} from "./notificationSlice";

// FETCH notifications (filter by role or userId)
function* fetchNotificationsSaga(action) {
  try {
    const { role, userId } = action.payload || {};

    const raw = yield call(() => getData("/notifications"));

    const list = Array.isArray(raw)
      ? raw.map((item) => ({ id: item.id, ...(item.data || item) }))
      : raw
      ? [{ id: raw.id, ...(raw.data || raw) }]
      : [];

    const filtered = (list || [])
      .filter(
        (n) =>
          (n.roles?.includes(role) || n.userId === userId) &&
          !(n.readBy || []).includes(userId)
      )
      .reverse();

    yield put(fetchNotificationsSuccess(filtered));
  } catch (err) {
    yield put(fetchNotificationsFailure(err.message));
  }
}

// MARK as read
function* markNotificationReadSaga(action) {
  try {
    const { id, userId } = action.payload;

    const raw = yield call(() => getData(`/notifications/${id}`));
    const notif = { id: raw.id, ...(raw.data || raw) };

    const updated = { ...notif, readBy: [...new Set([...(notif.readBy || []), userId])] };

    yield call(() => putData(`/notifications/${id}`, updated));
    yield put(markNotificationReadSuccess({ id, userId }));
  } catch (err) {
    yield put(markNotificationReadFailure(err.message));
  }
}

// CREATE notification
function* createNotificationSaga(action) {
  try {
    const data = action.payload;
    const res = yield call(() => postData("/notifications", data));
    yield put(createNotificationSuccess(res));
  } catch (err) {
    yield put(createNotificationFailure(err.message));
  }
}

export default function* notificationSaga() {
  yield all([
    takeLatest(fetchNotificationsRequest.type, fetchNotificationsSaga),
    takeLatest(markNotificationReadRequest.type, markNotificationReadSaga),
    takeLatest(createNotificationRequest.type, createNotificationSaga),
  ]);
}
