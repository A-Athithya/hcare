const initial = { list: [], loading: false, error: null };
export default function appointmentsReducer(state = initial, action) {
  switch (action.type) {
    case "appointments/fetchStart":
      return { ...state, loading: true, error: null };
    case "appointments/fetchSuccess":
      return { ...state, loading: false, list: action.payload };
    case "appointments/fetchFailure":
      return { ...state, loading: false, error: action.payload };
    case "appointments/createStart":
      return { ...state, loading: true };
    case "appointments/createSuccess":
      return { ...state, loading: false, list: [action.payload, ...state.list] };
    case "appointments/updateStatus":
      return {
        ...state,
        list: state.list.map((a) => (a.id === action.payload.id ? { ...a, status: action.payload.status } : a))
      };
    default:
      return state;
  }
}
