import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/news").then((res) => setNews(res.data)).catch(() => setNews([]));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div style={{ maxWidth: 500 }}>
          <h1>Healthcare Provider Portal</h1>
          <p>Manage patients, doctors, billing, and appointments in one place.</p>
          <Button type="primary" onClick={() => navigate("/dashboard")} style={{ marginRight: 10 }}>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/doctors")}>Browse Doctors</Button>
        </div>

        <div style={{ width: 400 }}>
          <Card title="Quick Links">
            <p><a href="/doctors">Browse Doctors</a></p>
            <p><a href="/appointments">Book Appointment</a></p>
          </Card>
        </div>
      </div>

      <h3 className="mt-4">Latest News</h3>
      <div className="row">
        {news.map((item) => (
          <div key={item.id} className="col-md-6">
            <Card title={item.title} style={{ margin: 8 }}>
              {item.content}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
