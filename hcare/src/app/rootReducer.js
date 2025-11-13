import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import prescriptionsReducer from "../features/prescriptions/prescriptionsSlice";
import billingReducer from "../features/billing/billingSlice";
import uiReducer from "../features/ui/uiSlice";
import staffReducer from "../features/staff/staffSlice";
import inventoryReducer from "../features/inventory/inventorySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  prescriptions: prescriptionsReducer,
  billing: billingReducer,
  ui: uiReducer,
  staff: staffReducer, 
  inventory: inventoryReducer,
});

export default rootReducer;
