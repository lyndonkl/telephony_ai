import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { mockDoctors, mockVisitStats, Doctor } from './types/doctor';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
  }
});

// In-memory storage
let doctors = [...mockDoctors];
const visitStats = [...mockVisitStats];

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial doctors list
  console.log('Sending initial doctors list:', doctors);
  socket.emit('doctors:list', doctors);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// REST endpoints
app.get('/api/doctors', (req, res) => {
  console.log('GET /api/doctors - Returning:', doctors);
  res.json(doctors);
});

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
  console.log('DELETE /api/doctors/:id - Request to delete doctor:', req.params.id);
  console.log('Current doctors before delete:', doctors);
  doctors = doctors.filter(d => d.id !== req.params.id);
  console.log('Doctors after delete:', doctors);
  io.emit('doctors:list', doctors);
  res.status(204).send();
});

app.post('/api/doctors/:id/highlight', (req, res) => {
  io.emit('doctor:highlight', req.params.id);
  res.status(200).send();
});

app.get('/api/visits/stats', (req, res) => {
  res.json(visitStats);
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 