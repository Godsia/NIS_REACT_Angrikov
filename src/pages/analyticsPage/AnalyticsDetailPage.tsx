import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const AnalyticsDetailPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const dateKey = date ?? '';
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateKey);

  if (!dateKey || !isValidDate) {
    return (
      <div>
        <Link to="/analytics">← К списку дат</Link>
        <Typography color="error" sx={{ mt: 2 }}>
          Неверная дата в адресе.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Link to="/analytics">← К списку дат</Link>
      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 2 }}>
        Аналитика за {formatDateLabel(dateKey)}
      </Typography>

      <Paper sx={{ p: 2, minHeight: 300 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Здесь можно разместить графики (Apache ECharts). Дата в URL: <strong>{dateKey}</strong>
        </Typography>
        <Box
          sx={{
            minHeight: 280,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          Область для графиков
        </Box>
      </Paper>
    </div>
  );
};
