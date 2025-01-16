import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Doctor, DoctorVisitStats } from './types/doctor';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const doctors: Doctor[] = [];
const visitStats: DoctorVisitStats[] = [];

app.use(cors());
app.use(express.json());

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial doctors list
  socket.emit('doctors:list', doctors);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// REST endpoints
app.post('/api/doctors', (req, res) => {
  const newDoctor: Doctor = {
    id: Date.now().toString(),
    ...req.body,
    lastVisited: new Date()
  };
  doctors.push(newDoctor);
  io.emit('doctors:list', doctors);
  res.status(201).json(newDoctor);
});

app.delete('/api/doctors/:id', (req, res) => {
  const index = doctors.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    doctors.splice(index, 1);
    io.emit('doctors:list', doctors);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

app.post('/api/doctors/:id/highlight', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (doctor) {
    io.emit('doctor:highlight', req.params.id);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 