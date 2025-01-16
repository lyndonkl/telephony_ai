# Doctor Visit Dashboard POC

A real-time dashboard showing doctor visits and statistics, designed to work alongside a telephony AI voice agent.

## Project Structure

The project is organized into two main directories:

- `backend/`: Express.js backend server
  - `src/`: Source files
  - `types/`: TypeScript interfaces
  - `server.ts`: Main server file
  - `Dockerfile`: Backend container configuration
  - `package.json`: Backend dependencies

- `ui/`: Next.js frontend application
  - `src/`: Source files
  - `components/`: React components
  - `pages/`: Next.js pages
  - `styles/`: CSS styles
  - `types/`: TypeScript interfaces
  - `utils/`: Utility functions
  - `Dockerfile`: Frontend container configuration
  - `package.json`: Frontend dependencies

## Prerequisites

- Docker and Docker Compose installed on your machine
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes both Docker Engine and Docker Compose)
  - For Linux users without Docker Desktop: Install [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 18+ (if running locally without Docker)

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-visit-dashboard
   ```

2. Create environment files:
   ```bash
   # In ui/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. Build and start the containers:
   ```bash
   # If you're using Docker Desktop or newer Docker versions:
   docker compose up --build
   
   # If you're using older Docker versions or have docker-compose installed:
   docker-compose up --build
   
   # Note: Use the same format for other docker compose commands in this guide
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Development Setup (Without Docker)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Frontend Setup

1. Navigate to the UI directory:
   ```bash
   cd ui
   npm install
   npm run dev
   ```

## API Documentation

### WebSocket Events

| Event | Description | Payload |
|-------|-------------|---------|
| `doctors:list` | Receives updates to doctors list | `Doctor[]` |
| `doctor:highlight` | Receives doctor highlight events | `string` (doctorId) |

### REST Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/doctors` | Add new doctor | `{ name: string, specialty: string }` |
| DELETE | `/api/doctors/:id` | Remove doctor | - |
| POST | `/api/doctors/:id/highlight` | Highlight doctor | - |
| GET | `/api/visits/stats` | Get visit statistics | - |

## Testing the Application

1. Add a test doctor:
   ```bash
   curl -X POST http://localhost:4000/api/doctors \
     -H "Content-Type: application/json" \
     -d '{"name":"Dr. Smith","specialty":"Cardiology"}'
   ```

2. Highlight a doctor (replace [doctor-id] with actual ID):
   ```bash
   curl -X POST http://localhost:4000/api/doctors/[doctor-id]/highlight
   ```

3. Delete a doctor using the UI's delete button

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Verify both servers are running
   - Check NEXT_PUBLIC_API_URL in .env.local
   - Ensure ports 3000 and 4000 are available

2. **Docker container issues**
   ```bash
   # Remove containers and volumes
   docker compose down -v
   
   # Rebuild and start
   docker compose up --build
   ```

3. **TypeScript/Dependency errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

## Development Notes

- Backend uses in-memory storage (data resets on server restart)
- WebSocket connections auto-reconnect
- Doctor highlight effect duration: 2 seconds
- Vega graph updates in real-time with new data

## License

MIT License - see the [LICENSE.md](LICENSE.md) file for details 