import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button } from "antd";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || null;

  const logout = () => {
    dispatch({ type: "auth/logout" });
  };

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <p>No user logged in.</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>My Profile</h2>
      <Card style={{ maxWidth: 700 }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.role && <p><strong>Role:</strong> {user.role}</p>}
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => alert("Edit profile not implemented")}>Edit Profile</Button>
          <Button style={{ marginLeft: 8 }} danger onClick={logout}>Logout</Button>
        </div>
      </Card>
    </div>
  );
}
