import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
import { Card, Typography, Grid, CircularProgress } from '@mui/material';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { loading, stats } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid container spacing={3} padding={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Dashboard Overview
        </Typography>
      </Grid>

      {stats &&
        Object.keys(stats).map((key) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card
              elevation={4}
              style={{
                padding: '20px',
                textAlign: 'center',
                borderRadius: '12px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {key.toUpperCase()}
              </Typography>
              <Typography variant="h4" color="primary">
                {stats[key]}
              </Typography>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
