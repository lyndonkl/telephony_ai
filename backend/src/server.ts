import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { mockDoctors, mockVisitStats, Doctor } from './types/doctor';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE']
  }
});

// In-memory storage
let doctors = [...mockDoctors];
const visitStats = [...mockVisitStats];

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.json());

// Helper function to extract tool call details
const extractToolCall = (req: express.Request) => {
  const toolCall = req.body?.message?.toolCalls?.[0];
  if (!toolCall) {
    return { toolCallId: 'default', args: req.body };
  }
  return {
    toolCallId: toolCall.id,
    args: toolCall.function.arguments
  };
};

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
  let doctorData;
  
  // Handle telephony format
  if (req.body?.message?.toolCalls) {
    doctorData = {
      name: req.body.name,
      specialty: req.body.specialty,
      lastVisited: req.body.lastVisisted // Note: handling the typo in the field name
    };

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      ...doctorData
    };

    doctors.push(newDoctor);
    io.emit('doctors:list', doctors);

    return res.status(201).json({
      result: `Created new doctor: ${newDoctor.name}`
    });
  }

  // Handle direct API calls
  const newDoctor: Doctor = {
    id: Date.now().toString(),
    ...req.body,
    lastVisited: new Date()
  };
  
  doctors.push(newDoctor);
  io.emit('doctors:list', doctors);
  res.status(201).json(newDoctor);
});

app.post('/api/doctors/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }
  
  doctors = doctors.filter(d => d.id !== id);
  io.emit('doctors:list', doctors);
  res.status(200).json({
    result: `Doctor ${id} deleted successfully`
  });
});

app.post('/api/doctors/highlight', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }
  
  io.emit('doctor:highlight', id);
  res.status(200).json({
    result: `Doctor ${id} highlighted successfully`
  });
});

app.post('/api/doctors/unhighlight', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }
  
  io.emit('doctor:unhighlight', id);
  res.status(200).json({
    result: `Doctor ${id} unhighlighted successfully`
  });
});

// Navigation endpoint
app.post('/api/navigate', (req, res) => {
  const { tab } = req.body;
  if (!tab) {
    return res.status(400).json({ error: 'Tab parameter is required' });
  }
  io.emit('navigation:change', tab);
  res.status(200).json({
    result: `Navigated to ${tab} tab successfully`
  });
});

// Month selection endpoint
app.post('/api/visits/month', (req, res) => {
  const { month } = req.body;
  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }
  io.emit('visits:setMonth', month);
  res.status(200).json({
    result: `Month set to ${month} successfully`
  });
});

app.get('/api/visits/stats', (req, res) => {
  res.json(mockVisitStats);
});

app.post('/api/viewRelationship', (req, res) => {
  const { familyMember, doctorId } = req.body;
  console.log('Received viewRelationship request:', { familyMember, doctorId });

  const doctorIdString = doctorId.toString();
  console.log('Emitting relationships:view event:', { doctorId, familyMember });
  io.emit('relationships:view', { 
    doctorId: doctorIdString,
    familyMember 
  });

  res.status(200).json({
    result: `Viewed relationship for ${familyMember} with ${doctorIdString}`
  });
});

app.post('/api/closeRelationship', (req, res) => {
  console.log('Received closeRelationship request');

  io.emit('relationships:close');

  res.status(200).json({
    result: 'Relationship view closed'
  });
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 