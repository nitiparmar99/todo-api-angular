# todo-api-angular

Small Angular frontend for the TODO API.

Prerequisites
- Node.js 20+ and npm.
- Angular CLI 16 is optional if available.

Run

```bash
cd todo-api-angular
npm install
npm start
```

The app will serve on `http://localhost:4200` by default.

Run order
- Start `todo-api-dotnetcore` first.
- Then run this frontend so it can call `http://localhost:5000/api`.

API
- The frontend calls the backend at `http://localhost:5000/api`.
- If you need to point it somewhere else, update `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

Tests

```bash
npm test
```

## Architecture

```mermaid
graph TB
    subgraph Browser["🌐 Browser (localhost:4200)"]
        AC["AppComponent<br/>(Root)"]
        TF["TodoFormComponent<br/>(Add todos)"]
        TL["TodoListComponent<br/>(Display todos)"]
        
        AC -->|imports| TF
        AC -->|imports| TL
    end
    
    subgraph Services["📦 Services"]
        TS["TodoService<br/>(HTTP calls)"]
        
        TF -->|uses| TS
        AC -->|uses| TS
    end
    
    subgraph Network["🔗 HTTP (localhost:5000/api)"]
        API["REST API<br/>Endpoints"]
    end
    
    subgraph Backend[".NET Core Backend"]
        TC["TodosController<br/>(GET, POST, DELETE)"]
        SVC["TodoService<br/>(Business logic)"]
        DTO["DTOs<br/>(CreateTodoDto, TodoDto)"]
        MODEL["TodoItem Model<br/>(In-memory storage)"]
        
        TC -->|uses| SVC
        SVC -->|uses| MODEL
        TC -->|maps| DTO
    end
    
    TS -->|calls| API
    API -->|handled by| TC
    TC -->|returns| DTO
    DTO -->|received as| MODEL
    
    style Browser fill:#e1f5ff
    style Services fill:#f3e5f5
    style Network fill:#fff3e0
    style Backend fill:#e8f5e9
```

## Features

- **Rich Text Editor** - Format descriptions with bold, italic, underline, and font size options
- **Responsive UI** - Clean card-based interface with proper alignment
- **Component-based** - Modular Angular standalone components
- **RESTful API** - Stateless backend with CRUD operations
- **Real-time Sync** - Changes instantly reflect between frontend and backend

Notes
- The backend must be running separately on port `5000`.
- Data is stored in-memory on the backend, so restarting the API clears the todo list.
