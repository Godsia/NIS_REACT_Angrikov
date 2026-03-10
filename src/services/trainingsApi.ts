const API_BASE = process.env.REACT_APP_API_URL ?? '';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface CreateTrainingBody {
  date: string;
  name?: string;
  type: 'POWER' | 'ENDURANCE';
  weightKg?: number;
  quantity?: number;
  distanceKm?: number;
  durationMinutes?: number;
  note?: string;
}

export interface TrainingRecord {
  id?: number;
  date: string;
  name?: string;
  type: 'POWER' | 'ENDURANCE';
  weightKg?: number;
  quantity?: number;
  distanceKm?: number;
  durationMinutes?: number;
  note?: string;
}

export const trainingsApi = {
  async getAll(_userId: number): Promise<TrainingRecord[]> {
    const res = await fetch(`${API_BASE}/api/trainings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Не удалось загрузить тренировки');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async create(training: CreateTrainingBody): Promise<TrainingRecord> {
    const res = await fetch(`${API_BASE}/api/trainings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(training),
    });
    if (!res.ok) throw new Error('Не удалось сохранить тренировку');
    return res.json();
  },
};
