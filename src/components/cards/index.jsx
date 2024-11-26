import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SummaryCards = ({ receita }) => (



  
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
          <Typography variant="h4">  R$ {receita.faturamento_anual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</Typography>
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
          <Typography variant="h4">  R$ {receita.faturamento_mensal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</Typography>
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
