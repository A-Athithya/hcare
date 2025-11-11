const initial = { list: [], loading: false, error: null };
export default function prescriptionsReducer(state = initial, action) {
  switch (action.type) {
    case "prescriptions/fetchStart":
      return { ...state, loading: true };
    case "prescriptions/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "prescriptions/createSuccess":
      return { ...state, list: [action.payload, ...state.list] };
    default:
      return state;
  }
}
