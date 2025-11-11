const initial = { list: [], loading: false, error: null };
export default function doctorsReducer(state = initial, action) {
  switch (action.type) {
    case "doctors/fetchStart":
      return { ...state, loading: true };
    case "doctors/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "doctors/fetchFailure":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
