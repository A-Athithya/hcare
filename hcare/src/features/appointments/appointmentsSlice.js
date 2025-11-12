const initial = { list: [], loading: false, error: null };

export default function appointmentsReducer(state = initial, action) {
  switch (action.type) {
    case "appointments/fetchStart":
      return { ...state, loading: true };
    case "appointments/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "appointments/fetchFailure":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
