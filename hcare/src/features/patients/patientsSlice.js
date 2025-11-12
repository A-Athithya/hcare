// src/features/patients/patientsSlice.js
const initialState = { list: [], loading: false, error: null };

export default function patientsReducer(state = initialState, action) {
  switch (action.type) {
    case "patients/fetchStart":
      return { ...state, loading: true, error: null };
    case "patients/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "patients/fetchFailure":
      return { ...state, loading: false, error: action.payload };

    case "patients/createStart":
      return { ...state, loading: true };
    case "patients/createSuccess":
      return { ...state, loading: false, list: [action.payload, ...state.list] };
    case "patients/createFailure":
      return { ...state, loading: false, error: action.payload };

    case "patients/updateStart":
      return { ...state, loading: true };
    case "patients/updateSuccess":
      return {
        ...state,
        loading: false,
        list: state.list.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "patients/updateFailure":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
