import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/client";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "./profileSlice";

function* fetchProfileWorker(action) {
  try {
    const { id, role, email } = action.payload || {};

    if (!role || !email) {
      throw new Error("Missing login user information");
    }

    let endpoint = "";

    switch (role) {
      case "admin":
        endpoint = `/admins/${id}`;
        break;

      case "doctor":
        endpoint = `/doctors?email=${encodeURIComponent(email)}`;
        break;

      case "patient":
        endpoint = `/patients?email=${encodeURIComponent(email)}`;
        break;

      case "nurse":
        endpoint = `/nurses?email=${encodeURIComponent(email)}`;
        break;

      case "pharmacist":
        endpoint = `/pharmacists?email=${encodeURIComponent(email)}`;
        break;

      case "receptionist":
        endpoint = `/receptionists?email=${encodeURIComponent(email)}`;
        break;

      default:
        throw new Error(`Unsupported role type: ${role}`);
    }

    const response = yield call(getData, endpoint);

    // json-server returns array for filtered calls
    const profile = Array.isArray(response) ? response[0] : response;

    if (!profile) {
      throw new Error("Profile not found");
    }

    yield put(fetchProfileSuccess(profile));
  } catch (error) {
    yield put(fetchProfileFailure(error.message));
  }
}

export default function* profileSaga() {
  yield takeLatest(fetchProfileStart.type, fetchProfileWorker);
}
