const initial = { list: [], loading: false, error: null };
export default function patientsReducer(state = initial, action) {
  switch (action.type) {
    case "patients/fetchStart":
      return { ...state, loading: true };
    case "patients/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "patients/fetchFailure":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
