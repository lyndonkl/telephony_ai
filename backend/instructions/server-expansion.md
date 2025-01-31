# Server Feature Expansion Guide

## 🎯 Objective

Guide for adding new features and endpoints to the Express/Socket.IO server while maintaining code quality and consistency.

## 📋 Pre-Implementation Checklist

1. [ ] Review existing codebase structure
2. [ ] Identify affected components
3. [ ] Plan WebSocket events (if needed)
4. [ ] Plan REST endpoints (if needed)
5. [ ] Consider error handling
6. [ ] Plan data validation
7. [ ] Update Swagger documentation

## 🏗️ Feature Implementation Template

```typescript
// 1. Add any new types needed
interface NewFeatureType {
  id: string;
  // ... other properties
}

// 2. Add in-memory storage (if needed)
let newFeatureData: NewFeatureType[] = [];

// 3. Add WebSocket events (if needed)
io.on('connection', (socket) => {
  // ... existing code ...
  
  socket.on('newFeature:action', (data) => {
    // Implement socket handler
    io.emit('newFeature:update', updatedData);
  });
});

// 4. Add REST endpoints
app.get('/api/new-feature', (req, res) => {
  try {
    // Implementation
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 📝 Best Practices

### 1. Error Handling

```typescript
app.post('/api/resource', (req, res) => {
  try {
    // Validate input
    if (!req.body.requiredField) {
      return res.status(400).json({ 
        error: 'Required field missing' 
      });
    }

    // Process request
    const result = processRequest(req.body);
    
    // Send response
    res.status(201).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});
```

### 2. WebSocket Event Pattern

```typescript
// Emit events with consistent naming
io.emit('resource:action', data);  // e.g., 'doctors:list'

// Listen for events
socket.on('resource:action', (data) => {
  // Handle event
  // Emit update if needed
  io.emit('resource:update', updatedData);
});
```

### 3. Input Validation

```typescript
const validateInput = (data: any): boolean => {
  if (!data.requiredField) return false;
  if (typeof data.numericField !== 'number') return false;
  return true;
};

app.post('/api/resource', (req, res) => {
  if (!validateInput(req.body)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  // Process valid input...
});
```

## 🔍 Testing New Features

1. WebSocket Events:

```typescript
// Test emit
socket.emit('newFeature:action', testData);

// Test receive
socket.on('newFeature:update', (data) => {
  console.log('Received update:', data);
});
```

2. REST Endpoints:

```bash
# Test GET
curl http://localhost:4000/api/new-feature

# Test POST
curl -X POST http://localhost:4000/api/new-feature \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

## ✅ Implementation Checklist

- [ ] Add new types/interfaces
- [ ] Implement data storage
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Add WebSocket events
- [ ] Add REST endpoints
- [ ] Update Swagger documentation
- [ ] Test all new features
- [ ] Add console logging for debugging
- [ ] Review security implications

## 🚫 Common Pitfalls to Avoid

1. **Inconsistent Error Handling**

   ```typescript
   // ❌ Bad
   if (!input) res.send('Error');
   
   // ✅ Good
   if (!input) {
     return res.status(400).json({ error: 'Invalid input' });
   }
   ```

2. **Missing Input Validation**

   ```typescript
   // ❌ Bad
   app.post('/api/resource', (req, res) => {
     processInput(req.body);  // Dangerous!
   });
   
   // ✅ Good
   app.post('/api/resource', (req, res) => {
     if (!validateInput(req.body)) {
       return res.status(400).json({ error: 'Invalid input' });
     }
     processInput(req.body);
   });
   ```

3. **Inconsistent Event Naming**

   ```typescript
   // ❌ Bad
   io.emit('updateDoctorsList', data);
   
   // ✅ Good
   io.emit('doctors:list', data);
   ```

## 📚 Example Feature Addition

Here's a complete example of adding a new feature:

```typescript
// 1. Add types
interface Comment {
  id: string;
  doctorId: string;
  text: string;
  createdAt: Date;
}

// 2. Add storage
let comments: Comment[] = [];

// 3. Add WebSocket events
io.on('connection', (socket) => {
  socket.on('comments:add', (data: { doctorId: string; text: string }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      doctorId: data.doctorId,
      text: data.text,
      createdAt: new Date()
    };
    comments.push(newComment);
    io.emit('comments:update', comments);
  });
});

// 4. Add REST endpoints
app.get('/api/comments/:doctorId', (req, res) => {
  try {
    const doctorComments = comments.filter(
      c => c.doctorId === req.params.doctorId
    );
    res.json(doctorComments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const { doctorId, text } = req.body;
    if (!doctorId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      doctorId,
      text,
      createdAt: new Date()
    };
    
    comments.push(newComment);
    io.emit('comments:update', comments);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

Remember: Always maintain consistency with the existing codebase and follow established patterns when adding new features.
