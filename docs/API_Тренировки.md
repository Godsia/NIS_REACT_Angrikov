# Запросы API: добавление тренировок

После авторизации используйте токен в заголовке:  
`Authorization: Bearer <ваш_токен>`.

---

## Типы тренировок

| Тип          | В API    | Поля                    |
|--------------|----------|--------------------------|
| **Силовая**  | `POWER`  | килограммы + количество раз |
| **Выносливость** | `ENDURANCE` | километраж + минуты   |

У каждой тренировки можно указать **название** (`name`), **дату** (`date`) и при необходимости **заметку** (`note`).

---

## 1. Силовая тренировка (POWER)

**Поля:** `weightKg` (кг), `quantity` (количество раз — повторения/подходы).

### Пример тела запроса (JSON)

```json
{
  "date": "2025-03-08",
  "name": "Жим лёжа",
  "type": "POWER",
  "weightKg": 80,
  "quantity": 10,
  "note": "3 подхода"
}
```

### cURL

```bash
curl -X POST http://localhost:8080/api/trainings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ВАШ_JWT_ТОКЕН" \
  -d '{
    "date": "2025-03-08",
    "name": "Жим лёжа",
    "type": "POWER",
    "weightKg": 80,
    "quantity": 10,
    "note": "3 подхода"
  }'
```

---

## 2. Тренировка на выносливость (ENDURANCE)

**Поля:** `distanceKm` (километраж), `durationMinutes` (минуты).

### Пример тела запроса (JSON)

```json
{
  "date": "2025-03-08",
  "name": "Бег",
  "type": "ENDURANCE",
  "distanceKm": 5.5,
  "durationMinutes": 32,
  "note": "лёгкий темп"
}
```

### cURL

```bash
curl -X POST http://localhost:8080/api/trainings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ВАШ_JWT_ТОКЕН" \
  -d '{
    "date": "2025-03-08",
    "name": "Бег",
    "type": "ENDURANCE",
    "distanceKm": 5.5,
    "durationMinutes": 32,
    "note": "лёгкий темп"
  }'
```

---

## Получение списка тренировок

```bash
curl -X GET http://localhost:8080/api/trainings \
  -H "Authorization: Bearer ВАШ_JWT_ТОКЕН"
```

---

## Краткая справка по полям

| Поле              | Обязательное | Описание |
|-------------------|--------------|----------|
| `date`            | да           | Дата в формате `YYYY-MM-DD` |
| `type`            | да           | `POWER` или `ENDURANCE` |
| `name`            | нет          | Название тренировки |
| `weightKg`        | для POWER*   | Вес в килограммах |
| `quantity`        | для POWER*   | Количество раз (повторения) |
| `distanceKm`      | для ENDURANCE* | Километраж |
| `durationMinutes` | для ENDURANCE* | Длительность в минутах |
| `note`            | нет          | Заметка |

\* Для силовой нужно указать хотя бы `weightKg` или `quantity`; для выносливости — хотя бы `distanceKm` или `durationMinutes`.
