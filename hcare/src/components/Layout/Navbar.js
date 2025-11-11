import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MuiAppBar, MuiToolbar, MuiButton } from "../../mui/MaterialDesign";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    navigate("/");
  };

  return (
    <MuiAppBar position="static">
      <MuiToolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="d-flex align-items-center gap-2">
          <img src="/logo192.png" alt="logo" width="36" />
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            HealthTool
          </Link>
        </div>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            style={{ padding: 6, borderRadius: 8, border: "none" }}
          />
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">My Profile</Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <MuiButton color="inherit" onClick={() => navigate("/login")}>Login</MuiButton>
              <MuiButton color="inherit" onClick={() => navigate("/register")}>Register</MuiButton>
            </>
          )}
        </div>
      </MuiToolbar>
    </MuiAppBar>
  );
}
