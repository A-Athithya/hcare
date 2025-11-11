import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import doctorsReducer from '../features/doctors/doctorsSlice';
import patientsReducer from '../features/patients/patientsSlice';
import appointmentsReducer from '../features/appointments/appointmentsSlice';
import prescriptionsReducer from '../features/prescriptions/prescriptionsSlice';
import billingReducer from '../features/billing/billingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  doctors: doctorsReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  prescriptions: prescriptionsReducer,
  billing: billingReducer,
});

export default rootReducer;
