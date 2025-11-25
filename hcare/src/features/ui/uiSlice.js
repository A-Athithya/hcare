const initialUI = {
  sidebarCollapsed: true,   // ✅ default ah icons-only mode
  notifications: []
};

export default function uiReducer(state = initialUI, action) {
  switch (action.type) {
    case "ui/toggleSidebar":
      return { 
        ...state, 
        sidebarCollapsed: !state.sidebarCollapsed 
      };

    case "ui/addNotification":
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };

    default:
      return state;
  }
}
