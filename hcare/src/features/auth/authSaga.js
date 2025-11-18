import { call, put, takeLatest } from "redux-saga/effects";
import client from "../../api/client";
import { generateToken } from "../../utils/tokenHelper";

function loginApi(email, password, role) {
  let endpoint = '';
  switch (role) {
    case 'admin':
      endpoint = '/users';
      break;
    case 'doctor':
      endpoint = '/doctors';
      break;
    case 'nurse':
      endpoint = '/nurses';
      break;
    case 'pharmacist':
      endpoint = '/pharmacists';
      break;
    case 'receptionist':
      endpoint = '/receptionists';
      break;
    case 'patient':
      endpoint = '/patients';
      break;
    default:
      return Promise.reject(new Error('Invalid role'));
  }
  return client.get(`${endpoint}?email=${email}&password=${password}`).then((r) => r.data);
}
function registerApi(payload) {
  return client.post("/users", payload).then((r) => r.data);
}

function* login(action) {
  try {
    const { email, password, role } = action.payload;
    const users = yield call(loginApi, email, password, role);
    if (users.length === 1) {
      const token = generateToken();
      yield put({ type: "auth/loginSuccess", payload: { user: users[0], token } });
    } else {
      yield put({ type: "auth/loginFailure", payload: "Invalid credentials" });
    }
  } catch (e) {
    yield put({ type: "auth/loginFailure", payload: e.message });
  }
}

function* register(action) {
  try {
    const exists = yield call(() => client.get(`/users?email=${action.payload.email}`).then((r) => r.data));
    if (exists.length > 0) {
      yield put({ type: "auth/registerFailure", payload: "Email already registered" });
      return;
    }
    yield call(registerApi, action.payload);
    yield put({ type: "auth/registerSuccess" });
  } catch (e) {
    yield put({ type: "auth/registerFailure", payload: e.message });
  }
}

export default function* authSaga() {
  yield takeLatest("auth/loginStart", login);
  yield takeLatest("auth/registerStart", register);
}
