import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:4000')

const testMedicalInfo = {
  id: 'test-123',
  type: 'article',
  title: 'Test Medical Article',
  content: 'This is a test article about heart rate monitoring...',
  timestamp: new Date(),
  doctorId: 'doc-test',
  doctorName: 'Dr. Test',
  severity: 'medium',
  metadata: {
    articleUrl: 'https://test.com/article',
    articleSource: 'Test Medical Journal',
    tags: ['test', 'heart-rate'],
  },
}

ws.on('open', () => {
  console.log('Connected to WebSocket server')

  // Send test medical info
  ws.send(
    JSON.stringify({
      type: 'doctor:medical-info',
      data: testMedicalInfo,
    })
  )

  console.log('Sent test medical info')
})

ws.on('message', (data) => {
  console.log('Received:', data.toString())
})

ws.on('error', (error) => {
  console.error('WebSocket error:', error)
})

ws.on('close', () => {
  console.log('Disconnected from WebSocket server')
})
