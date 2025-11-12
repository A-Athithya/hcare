import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import uiReducer from "../features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  ui: uiReducer,
});

export default rootReducer;
