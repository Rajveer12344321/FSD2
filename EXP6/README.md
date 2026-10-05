# Student Task Manager — Experiment 6

Spring Boot + H2 backend (pagination, caching, JOIN FETCH, native SQL) with a React + Vite frontend.
The backend is unchanged from the original project; only the frontend UI has been redesigned.

## Requirements
- JDK 17 or newer (`java -version`)
- Maven 3.8+ (`mvn -v`)
- Node.js 18+ (`node -v`)

## Run in VS Code
Open this folder in VS Code, then either press **Ctrl+Shift+P → Tasks: Run Task → Run Everything**,
or use two terminals:

```bash
# Terminal 1 — backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install        # first time only
npm run dev
```

Open http://localhost:5173. Start the backend first; if it isn't running, the UI shows a retry banner.

H2 console: http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:testdb`, user `sa`, empty password.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks?page=0&size=5&sort=id,desc` | Paginated, sorted tasks |
| GET | `/api/tasks/with-comments` | JOIN FETCH + `@Cacheable` (1.5 s on first call) |
| GET | `/api/tasks/top` | Native SQL, latest 5 |
| POST | `/api/tasks` | Add a task |
| PUT | `/api/tasks/{id}/toggle` | Toggle completion |
| DELETE | `/api/tasks/{id}` | Delete a task |

See `EXPLANATION.md` for the concepts covered.
