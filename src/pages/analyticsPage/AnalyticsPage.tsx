import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {useAppSelector} from "../../store/hooks";
import {trainingsApi, TrainingRecord} from "../../services/trainingsApi";


import {
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material';


import BarChartComponent from "./BarChartComponent";
import './AnalyticsPage.css';

function getUniqueExercises(trainings: TrainingRecord[]): string[] {
  const set = new Set<string>();

  for (const t of trainings) {
    const name = t.name?.trim();
    if (name) set.add(name);
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

type ChartPeriod = 'week' | 'month';

function getWeekKey(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayOfWeek = date.getDay();
  const toMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + toMonday);
  const y2 = date.getFullYear();
  const m2 = String(date.getMonth() + 1).padStart(2, '0');
  const d2 = String(date.getDate()).padStart(2, '0');
  return `${y2}-${m2}-${d2}`;
}

function getMonthKey(dateStr: string): string {
  return dateStr.length >= 7 ? dateStr.slice(0, 7) : '';
}

function getExerciseType(
  trainings: TrainingRecord[],
  exerciseName: string
): 'POWER' | 'ENDURANCE' | null {
  const t = trainings.find(
    (r) => r.name?.trim() === exerciseName
  );
  return t?.type ?? null;
}

function getExerciseValuesByDate(
  trainings: TrainingRecord[],
  exerciseName: string
): {
  dates: string[];
  type: 'POWER' | 'ENDURANCE';
  series: { name: string; data: number[]; color?: string }[];
} | null {
  const type = getExerciseType(trainings, exerciseName);
  if (!type) return null;

  const byDate = new Map<
    string,
    { weightVolume: number; quantitySum: number; distanceSum: number; durationSum: number }
  >();

  for (const t of trainings) {
    if (t.name?.trim() !== exerciseName) continue;
    const d =
      typeof t.date === 'string' && t.date.length >= 10
        ? t.date.slice(0, 10)
        : '';
    if (!d) continue;

    const cur = byDate.get(d) ?? {
      weightVolume: 0,
      quantitySum: 0,
      distanceSum: 0,
      durationSum: 0,
    };

    if (type === 'POWER') {
      const w = t.weightKg ?? 0;
      const q = t.quantity ?? 0;
      cur.weightVolume += w * q;
      cur.quantitySum += q;
    } else {
      cur.distanceSum += t.distanceKm ?? 0;
      cur.durationSum += t.durationMinutes ?? 0;
    }
    byDate.set(d, cur);
  }

  const sorted = Array.from(byDate.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const dates = sorted.map(([d]) => d);

  if (type === 'POWER') {
    const weights = sorted.map(([, v]) =>
      v.quantitySum > 0 ? v.weightVolume / v.quantitySum : 0
    );
    const quantities = sorted.map(([, v]) => v.quantitySum);
    return {
      dates,
      type: 'POWER',
      series: [
        { name: 'Вес, кг', data: weights, color: '#4f46e5' },
        { name: 'Повторения', data: quantities, color: '#059669' },
      ],
    };
  } else {
    const distances = sorted.map(([, v]) => v.distanceSum);
    const durations = sorted.map(([, v]) => v.durationSum);
    return {
      dates,
      type: 'ENDURANCE',
      series: [
        { name: 'Дистанция, км', data: distances, color: '#0284c7' },
        { name: 'Минуты', data: durations, color: '#ca8a04' },
      ],
    };
  }
}

function getExerciseDataByWeek(
  trainings: TrainingRecord[],
  exerciseName: string
): { dates: string[]; counts: number[] } {
  const byWeek = new Map<string, number>();

  for (const t of trainings) {
    if (t.name?.trim() !== exerciseName) continue;
    const d =
      typeof t.date === 'string' && t.date.length >= 10
        ? t.date.slice(0, 10)
        : '';
    if (!d) continue;
    const weekKey = getWeekKey(d);
    byWeek.set(weekKey, (byWeek.get(weekKey) ?? 0) + 1);
  }

  const sorted = Array.from(byWeek.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return {
    dates: sorted.map(([date]) => date),
    counts: sorted.map(([, count]) => count),
  };
}

function getExerciseDataByMonth(
  trainings: TrainingRecord[],
  exerciseName: string
): { dates: string[]; counts: number[] } {
  const byMonth = new Map<string, number>();

  for (const t of trainings) {
    if (t.name?.trim() !== exerciseName) continue;
    const d =
      typeof t.date === 'string' && t.date.length >= 10
        ? t.date.slice(0, 10)
        : '';
    if (!d) continue;
    const monthKey = getMonthKey(d);
    if (!monthKey) continue;
    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + 1);
  }

  const sorted = Array.from(byMonth.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return {
    dates: sorted.map(([date]) => date),
    counts: sorted.map(([, count]) => count),
  };
}

function formatDateShort(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

function formatWeekLabel(weekStartKey: string): string {
  const [y, m, d] = weekStartKey.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const startStr = start.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
  const endStr = end.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
  return `${startStr} – ${endStr}`;
}

function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('ru-RU', {
    month: 'short',
    year: 'numeric',
  });
}

export const AnalyticsPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('week');

  const exercises = useMemo(
      () => getUniqueExercises(trainings),
      [trainings]
  );

  const chartData = useMemo(() => {
    if (!selectedExercise) return null;
    return chartPeriod === 'month'
      ? getExerciseDataByMonth(trainings, selectedExercise)
      : getExerciseDataByWeek(trainings, selectedExercise);
  }, [trainings, selectedExercise, chartPeriod]);

  const valuesByDate = useMemo(() => {
    if (!selectedExercise) return null;
    return getExerciseValuesByDate(trainings, selectedExercise);
  }, [trainings, selectedExercise]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    trainingsApi
        .getAll(user.id)
        .then((data) => {
          if (!cancelled) setTrainings(data);
        })
        .catch((e) => {
          if (!cancelled)
            setError(e instanceof Error ? e.message : 'Ошибка загрузки');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
      <div className="analytics">

        <div className="analytics-container">

          <header className="analytics-header">

            <div>
              <h1 className="analytics-title">Аналитика тренировок</h1>

              <p className="analytics-subtitle">
                Просмотр статистики по упражнениям
              </p>
            </div>

            <Link to="/">
              <Button variant="outlined">
                ← На главную
              </Button>
            </Link>

          </header>

          {loading && (
              <div className="analytics-loading">
                <CircularProgress />
              </div>
          )}

          {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
          )}

          {!loading && !error && trainings.length === 0 && (
              <Paper className="analytics-empty">
                <Typography color="text.secondary">
                  Нет данных для анализа. Добавьте тренировки.
                </Typography>
              </Paper>
          )}

          {!loading && !error && exercises.length > 0 && (
              <div className="analytics-layout">

                <Paper className="analytics-exercises">

                  <List disablePadding>

                    {exercises.map((name, index) => (

                        <ListItemButton
                            key={name}
                            selected={selectedExercise === name}
                            onClick={() => setSelectedExercise(name)}
                            divider={index < exercises.length - 1}
                        >
                          <ListItemText primary={name} />
                        </ListItemButton>

                    ))}

                  </List>

                </Paper>

                <div className="analytics-charts">
                  <Card className="analytics-chart">

                    <CardContent>

                      {!selectedExercise && (
                          <Typography color="text.secondary">
                            Выберите упражнение слева
                          </Typography>
                      )}

                      {selectedExercise && chartData && (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 2,
                                mb: 3,
                              }}
                            >
                              <Typography variant="h6">
                                {selectedExercise}
                              </Typography>
                              <ToggleButtonGroup
                                value={chartPeriod}
                                exclusive
                                onChange={(_, value: ChartPeriod | null) =>
                                  value && setChartPeriod(value)
                                }
                                size="small"
                              >
                                <ToggleButton value="week">По неделям</ToggleButton>
                                <ToggleButton value="month">По месяцам</ToggleButton>
                              </ToggleButtonGroup>
                            </Box>

                            {chartData.dates.length > 0 ? (
                                <BarChartComponent
                                    xAxisData={chartData.dates.map((key) =>
                                      chartPeriod === 'week'
                                        ? formatWeekLabel(key)
                                        : formatMonthLabel(key)
                                    )}
                                    seriesData={chartData.counts}
                                    yAxisName="Количество тренировок"
                                    title=""
                                    color="#4f46e5"
                                />
                            ) : (
                                <Typography color="text.secondary">
                                  Нет записей по выбранному упражнению
                                </Typography>
                            )}
                          </>
                      )}

                    </CardContent>

                  </Card>

                  {selectedExercise && valuesByDate && valuesByDate.dates.length > 0 && (
                    <Card className="analytics-chart analytics-chart--values">
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {selectedExercise} — по датам
                        </Typography>
                        <BarChartComponent
                          xAxisData={valuesByDate.dates.map(formatDateShort)}
                          seriesList={valuesByDate.series}
                          yAxisNames={
                            valuesByDate.type === 'POWER'
                              ? ['Вес, кг', 'Повторения']
                              : ['Дистанция, км', 'Минуты']
                          }
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>

              </div>
          )}

        </div>

      </div>
  );
};