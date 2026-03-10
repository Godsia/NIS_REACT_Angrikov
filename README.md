# Training Analysis – Backend

Backend for the training analysis web app: **registration/login** and **training entries** (date + endurance: either kg+quantity or km+time).

## Run

- **Java 17** required.
- From project root:

```bash
mvn spring-boot:run
```

Server: **http://localhost:8080**

**Swagger UI:** http://localhost:8080/swagger-ui.html — документация и тестирование API. Для защищённых запросов нажмите "Authorize" и вставьте JWT (без слова Bearer).

## API

### Auth (no token)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | `{ "email": "...", "password": "..." }` | Register (password min 6 chars) |
| POST | `/api/auth/login`    | `{ "email": "...", "password": "..." }` | Login |

**Response:** `{ "token": "JWT...", "email": "...", "userId": 1 }`

Use the `token` in the header for protected endpoints:

```
Authorization: Bearer <token>
```

### Trainings (require `Authorization: Bearer <token>`)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET    | `/api/trainings`     | – | List my trainings (newest first) |
| GET    | `/api/trainings/{id}`| – | Get one training |
| POST   | `/api/trainings`     | see below | Create training |
| PUT    | `/api/trainings/{id}`| see below | Update training |
| DELETE | `/api/trainings/{id}`| – | Delete training |

**Create/Update body:**

- `date` (required): `"YYYY-MM-DD"`
- `type` (required): `"WEIGHT_BASED"` or `"DISTANCE_BASED"`
- **POWER** (силовая): `weightKg` (кг), `quantity` (количество раз). Хотя бы одно обязательно.
- **ENDURANCE** (выносливость): `distanceKm` (км), `durationMinutes` (минуты). Хотя бы одно обязательно.
- `name` (optional): название тренировки
- `note` (optional): заметка

Примеры:

```json
{ "date": "2025-03-08", "name": "Жим лёжа", "type": "POWER", "weightKg": 80, "quantity": 10 }
{ "date": "2025-03-08", "name": "Бег", "type": "ENDURANCE", "distanceKm": 5.5, "durationMinutes": 32 }
```

## Tech

- Spring Boot 3, Spring Security (JWT), Spring Data JPA
- H2 in-memory DB (data resets on restart). H2 console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:trainingdb`, user: `sa`, password empty)
- For production: set `app.jwt.secret` and switch datasource to PostgreSQL/MySQL in `application.yml`.
