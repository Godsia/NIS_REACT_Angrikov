import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { trainingsApi, TrainingRecord } from '../../services/trainingsApi';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import PieChartComponent from './PieChartComponent';
import './TrainingList.css';

const formatDayLabel = (dateKey: string) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const groupByDate = (records: TrainingRecord[]): [string, TrainingRecord[]][] => {
  const map = new Map<string, TrainingRecord[]>();
  for (const t of records) {
    const dateStr = t.date?.slice(0, 10);
    if (!dateStr) continue;
    if (!map.has(dateStr)) map.set(dateStr, []);
    map.get(dateStr)!.push(t);
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
};

const getPieDataForDay = (dayTrainings: TrainingRecord[]) => {
  const powerCount = dayTrainings.filter((t) => t.type === 'POWER').length;
  const enduranceCount = dayTrainings.filter((t) => t.type === 'ENDURANCE').length;
  const items = [];
  if (powerCount > 0) items.push({ value: powerCount, name: 'Силовые', itemStyle: { color: '#5470c6' } });
  if (enduranceCount > 0) items.push({ value: enduranceCount, name: 'Выносливость', itemStyle: { color: '#fac858' } });
  return items.length ? items : [{ value: 1, name: 'Нет данных', itemStyle: { color: '#e0e0e0' } }];
};

export const TrainingList: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'basic' | 'donut' | 'rose'>('donut');

  const byDate = useMemo(() => groupByDate(trainings), [trainings]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    trainingsApi.getAll(user.id)
        .then((data) => { if (!cancelled) setTrainings(data); })
        .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка загрузки'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleChartTypeChange = (_e: React.MouseEvent<HTMLElement>, newType: 'basic' | 'donut' | 'rose' | null) => {
    if (newType) setChartType(newType);
  };

  return (
      <Box className="training-list-page">
        <Box className="training-list-header">
          <Typography variant="h4">Ваши тренировки</Typography>
          <Link to="/" className="training-list-back">← На главную</Link>
        </Box>

        {loading && <Box className="loading"><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && trainings.length > 0 && (
            <>
              <Box className="chart-toggle">
                <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange} size="small">
                  <ToggleButton value="basic">Обычная</ToggleButton>
                  <ToggleButton value="donut">Кольцевая</ToggleButton>
                  <ToggleButton value="rose">Розовая</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box className="training-cards">
                {byDate.map(([dateKey, dayTrainings]) => {
                  const pieData = getPieDataForDay(dayTrainings);
                  const powerCount = dayTrainings.filter((t) => t.type === 'POWER').length;
                  const enduranceCount = dayTrainings.filter((t) => t.type === 'ENDURANCE').length;
                  const total = dayTrainings.length;
                  return (
                      <Paper key={dateKey} className="day-card">
                        <Typography className="day-label">{formatDayLabel(dateKey)}</Typography>
                        <Box className="day-content">
                          <Card className="pie-card">
                            <CardContent>
                              <Typography variant="subtitle2">Соотношение за день</Typography>
                              <PieChartComponent data={pieData} type={chartType} title="" />
                              <Box className="chip-group">
                                <Chip label={`Силовые: ${powerCount}`} className="chip-power" size="small"/>
                                <Chip label={`Выносливость: ${enduranceCount}`} className="chip-endurance" size="small"/>
                              </Box>
                            </CardContent>
                          </Card>
                          <Box className="training-list">
                            {dayTrainings.map((t) => (
                                <Card key={t.id ?? t.date + t.name + t.type} className="training-card">
                                  <CardContent>
                                    <Box className="training-header">
                                      <Box className={`training-dot ${t.type === 'POWER' ? 'dot-power' : 'dot-endurance'}`}></Box>
                                      <Typography fontWeight="bold">{t.name ?? (t.type === 'POWER' ? 'Силовая' : 'Выносливость')}</Typography>
                                    </Box>
                                    {t.type === 'POWER' && <Typography>{t.weightKg} кг × {t.quantity} повторений</Typography>}
                                    {t.type === 'ENDURANCE' && <Typography>{t.distanceKm} км за {t.durationMinutes} мин</Typography>}
                                    {t.note && <Typography className="training-note">{t.note}</Typography>}
                                  </CardContent>
                                </Card>
                            ))}
                          </Box>
                        </Box>
                      </Paper>
                  );
                })}
              </Box>
            </>
        )}

        {!loading && !error && trainings.length === 0 && (
            <Alert severity="info">Пока нет записей. Добавьте тренировку на странице ввода данных.</Alert>
        )}
      </Box>
  );
};