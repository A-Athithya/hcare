import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import prescriptionsReducer from "../features/prescriptions/prescriptionsSlice";
import billingReducer from "../features/billing/billingSlice";
import uiReducer from "../features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  prescriptions: prescriptionsReducer,
  billing: billingReducer,
  ui: uiReducer,
});

export default rootReducer;
