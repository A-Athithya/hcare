const initial = { invoices: [], loading: false, error: null };
export default function billingReducer(state = initial, action) {
  switch (action.type) {
    case "billing/fetchStart":
      return { ...state, loading: true };
    case "billing/fetchSuccess":
      return { ...state, loading: false, invoices: action.payload };
    case "billing/createSuccess":
      return { ...state, invoices: [action.payload, ...state.invoices] };
    default:
      return state;
  }
}
