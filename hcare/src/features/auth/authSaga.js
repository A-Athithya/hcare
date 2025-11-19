// src/features/auth/authSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/client";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "./authSlice";

// API call to get all users
function* loginSaga(action) {
  try {
    const { email, password, role } = action.payload;

    // 1) Fetch all users from db.json
    const users = yield call(getData, "/users");

    if (!users || !Array.isArray(users)) {
      yield put(loginFailure("User database not found"));
      return;
    }

    // 2) Match user with email + password + role
    const found = users.find(
      (u) =>
        u.email?.toLowerCase() === email?.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!found) {
      yield put(loginFailure("Invalid credentials"));
      return;
    }

    // 3) SUCCESS
    yield put(loginSuccess(found));
  } catch (err) {
    yield put(loginFailure("Login failed"));
  }
}

export default function* authRootSaga() {
  yield takeLatest(loginStart.type, loginSaga);
}
