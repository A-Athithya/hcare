// src/features/appointments/appointmentsSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { getData, putData } from "../../api/client";

// Fetch appointments
function* fetchAppointments() {
  try {
    const data = yield call(getData, "/appointments");
    yield put({ type: "appointments/fetchSuccess", payload: data });
  } catch (e) {
    yield put({ type: "appointments/fetchFailure", payload: e.message });
  }
}

// ✅ Update status + create billing when completed
function* updateAppointmentStatus(action) {
  try {
    const { appointment, status } = action.payload;

    const updatedAppointment = {
      ...appointment,
      status,
    };

    yield call(putData, `/appointments/${appointment.id}`, updatedAppointment);

    yield put({
      type: "appointments/updateSuccess",
      payload: updatedAppointment,
    });

    // ✅ If Completed → Create Billing Entry
    if (status === "Completed") {
      const billingPayload = {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        amount: appointment.consultationFee || 500,
        status: "Unpaid",
        date: new Date().toISOString().split("T")[0],
      };

      yield put({
        type: "billing/createStart",
        payload: billingPayload,
      });
    }

  } catch (e) {
    yield put({
      type: "appointments/updateFailure",
      payload: e.message,
    });
  }
}

export default function* appointmentsSaga() {
  yield takeLatest("appointments/fetchStart", fetchAppointments);
  yield takeLatest("appointments/updateStatus", updateAppointmentStatus);
}
