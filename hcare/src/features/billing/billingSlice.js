// src/features/billing/billingSlice.js
const initialState = {
  list: [],
  loading: false,
  error: null,
};

export default function billingReducer(state = initialState, action) {
  switch (action.type) {
    case "billing/fetchStart":
      return { ...state, loading: true };

    case "billing/fetchSuccess":
      return { ...state, loading: false, list: action.payload };

    case "billing/fetchFailure":
      return { ...state, loading: false, error: action.payload };

    case "billing/createSuccess":
      return { ...state, list: [action.payload, ...state.list] };

    default:
      return state;
  }
}
