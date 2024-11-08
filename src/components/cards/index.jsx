import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SummaryCards = () => (
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <Card
        style={{
          background: 'linear-gradient(135deg, #4a6cf7, #8a4ef7)',
          color: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          marginLeft: '10px'
        }}
      >
        <CardContent>
          <MonetizationOnIcon style={{ fontSize: 40, marginBottom: 10, }} />
          <Typography variant="h6">Faturamento</Typography>
          <Typography variant="h4">R$10.214.809</Typography>
          <Typography>+54% vs. ano anterior</Typography>
         

        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={4}>
      <Card
        style={{
          background: 'linear-gradient(135deg, #ff5e57, #ff7f57)',
          color: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
        }}
      >
        <CardContent>
          <TrackChangesIcon style={{ fontSize: 40, marginBottom: 10 }} />
          <Typography variant="h6">Renda Este Mês</Typography>
          <Typography variant="h4">2.214.809</Typography>
          <Typography>+28% vs. ano anterior</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={4}>
      <Card
        style={{
          background: 'linear-gradient(135deg, #1ec4a1, #00d4b4)',
          color: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
        }}
      >
        <CardContent>
          <TrendingUpIcon style={{ fontSize: 40, marginBottom: 10 }} />
          <Typography variant="h6">Agendamentos</Typography>
          <Typography variant="h4">318</Typography>
          <Typography>+16% vs. ano anterior</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default SummaryCards;
