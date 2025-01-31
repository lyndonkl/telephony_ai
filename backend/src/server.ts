import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { mockDoctors, mockVisitStats, Doctor } from './types/doctor'
import { MedicalInfo } from './types/medical'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: /^http:\/\/localhost:[0-9]+$/,
    methods: ['GET', 'POST', 'DELETE'],
  },
})

// In-memory storage
let doctors = [...mockDoctors]
const visitStats = [...mockVisitStats]

// 1. Add new types
interface DoctorReview {
  id: string
  doctorId: string
  rating: number // 1-5 stars
  comment: string
  createdAt: Date
  authorName: string
}

// 2. Add in-memory storage
let doctorReviews: DoctorReview[] = []

// Add medical info storage
let medicalInfos: MedicalInfo[] = []

// Middleware
app.use(
  cors({
    origin: /^http:\/\/localhost:[0-9]+$/,
    methods: ['GET', 'POST', 'DELETE'],
  })
)
app.use(express.json())

// Helper function to extract tool call details
const extractToolCall = (req: express.Request) => {
  const toolCall = req.body?.message?.toolCalls?.[0]
  if (!toolCall) {
    return { toolCallId: 'default', args: req.body }
  }
  return {
    toolCallId: toolCall.id,
    args: toolCall.function.arguments,
  }
}

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected')

  // Send initial doctors list
  console.log('Sending initial doctors list:', doctors)
  socket.emit('doctors:list', doctors)

  // Send initial reviews list
  socket.emit('reviews:list', doctorReviews)

  // Add medical info events
  socket.emit('medical:list', medicalInfos)

  socket.on('doctor:medical-info', (info: MedicalInfo) => {
    console.log('Received medical info:', info)
    medicalInfos.push({
      ...info,
      timestamp: new Date(info.timestamp), // Ensure timestamp is Date object
    })
    io.emit('doctor:medical-info', info)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })

  socket.on(
    'reviews:add',
    (data: {
      doctorId: string
      rating: number
      comment: string
      authorName: string
    }) => {
      const newReview: DoctorReview = {
        id: Date.now().toString(),
        doctorId: data.doctorId,
        rating: Math.max(1, Math.min(5, data.rating)), // Ensure rating is between 1-5
        comment: data.comment,
        authorName: data.authorName,
        createdAt: new Date(),
      }

      doctorReviews.push(newReview)
      io.emit('reviews:list', doctorReviews)
    }
  )
})

// REST endpoints
app.get('/api/doctors', (req, res) => {
  console.log('GET /api/doctors - Returning:', doctors)
  res.json(doctors)
})

app.post('/api/doctors', (req, res) => {
  let doctorData

  // Handle telephony format
  if (req.body?.message?.toolCalls) {
    doctorData = {
      name: req.body.name,
      specialty: req.body.specialty,
      lastVisited: req.body.lastVisisted, // Note: handling the typo in the field name
    }

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      ...doctorData,
    }

    doctors.push(newDoctor)
    io.emit('doctors:list', doctors)

    return res.status(201).json({
      result: `Created new doctor: ${newDoctor.name}`,
    })
  }

  // Handle direct API calls
  const newDoctor: Doctor = {
    id: Date.now().toString(),
    ...req.body,
    lastVisited: new Date(),
  }

  doctors.push(newDoctor)
  io.emit('doctors:list', doctors)
  res.status(201).json(newDoctor)
})

app.post('/api/doctors/delete', (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' })
  }

  doctors = doctors.filter((d) => d.id !== id)
  io.emit('doctors:list', doctors)
  res.status(200).json({
    result: `Doctor ${id} deleted successfully`,
  })
})

app.post('/api/doctors/highlight', (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' })
  }

  io.emit('doctor:highlight', id)
  res.status(200).json({
    result: `Doctor ${id} highlighted successfully`,
  })
})

app.post('/api/doctors/unhighlight', (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Doctor ID is required' })
  }

  io.emit('doctor:unhighlight', id)
  res.status(200).json({
    result: `Doctor ${id} unhighlighted successfully`,
  })
})

// Navigation endpoint
app.post('/api/navigate', (req, res) => {
  const { tab } = req.body
  if (!tab) {
    return res.status(400).json({ error: 'Tab parameter is required' })
  }
  io.emit('navigation:change', tab)
  res.status(200).json({
    result: `Navigated to ${tab} tab successfully`,
  })
})

// Month selection endpoint
app.post('/api/visits/month', (req, res) => {
  const { month } = req.body
  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' })
  }
  io.emit('visits:setMonth', month)
  res.status(200).json({
    result: `Month set to ${month} successfully`,
  })
})

app.get('/api/visits/stats', (req, res) => {
  res.json(mockVisitStats)
})

app.post('/api/viewRelationship', (req, res) => {
  const { familyMember, doctorId } = req.body
  console.log('Received viewRelationship request:', { familyMember, doctorId })

  const doctorIdString = doctorId.toString()
  console.log('Emitting relationships:view event:', { doctorId, familyMember })
  io.emit('relationships:view', {
    doctorId: doctorIdString,
    familyMember,
  })

  res.status(200).json({
    result: `Viewed relationship for ${familyMember} with ${doctorIdString}`,
  })
})

app.post('/api/closeRelationship', (req, res) => {
  console.log('Received closeRelationship request')

  io.emit('relationships:close')

  res.status(200).json({
    result: 'Relationship view closed',
  })
})

// 4. Add REST endpoints
app.get('/api/reviews/:doctorId', (req, res) => {
  try {
    const doctorId = req.params.doctorId
    const reviews = doctorReviews.filter(
      (review) => review.doctorId === doctorId
    )
    res.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/reviews', (req, res) => {
  try {
    const { doctorId, rating, comment, authorName } = req.body

    // Input validation
    if (!doctorId || !rating || !comment || !authorName) {
      return res.status(400).json({
        error: 'Missing required fields',
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      })
    }

    const newReview: DoctorReview = {
      id: Date.now().toString(),
      doctorId,
      rating,
      comment,
      authorName,
      createdAt: new Date(),
    }

    doctorReviews.push(newReview)
    io.emit('reviews:list', doctorReviews)
    res.status(201).json(newReview)
  } catch (error) {
    console.error('Error creating review:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/reviews/:reviewId', (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const reviewIndex = doctorReviews.findIndex((r) => r.id === reviewId)

    if (reviewIndex === -1) {
      return res.status(404).json({
        error: 'Review not found',
      })
    }

    doctorReviews.splice(reviewIndex, 1)
    io.emit('reviews:list', doctorReviews)
    res.status(200).json({
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Add REST endpoint for medical info
app.post('/api/medical-info', (req, res) => {
  try {
    // Let's fix it to handle arrays properly:
    const infoArray = Array.isArray(req.body) ? req.body : [req.body]

    // Process each item in the array
    const processedInfos = infoArray.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp || Date.now()),
    }))

    // Add to storage
    medicalInfos.push(...processedInfos)

    // Emit the array
    io.emit('doctor:medical-info', processedInfos)

    res.status(200).json({
      success: true,
      message: `Medical info sent successfully`,
    })
  } catch (error) {
    console.error('Error sending medical info:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

// Get all medical info
app.get('/api/medical-info', (req, res) => {
  res.json(medicalInfos)
})

// Get medical info by doctor
app.get('/api/medical-info/doctor/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId
  const doctorMedicalInfo = medicalInfos.filter(
    (info) => info.doctorId === doctorId
  )
  res.json(doctorMedicalInfo)
})

// Delete medical info
app.delete('/api/medical-info/:id', (req, res) => {
  const id = req.params.id
  const index = medicalInfos.findIndex((info) => info.id === id)

  if (index === -1) {
    return res.status(404).json({
      error: 'Medical info not found',
    })
  }

  medicalInfos.splice(index, 1)
  io.emit('medical:list', medicalInfos)

  res.json({
    success: true,
    message: 'Medical info deleted successfully',
  })
})

// Start server
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
