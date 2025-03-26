
# Station Manager API Server

This is the backend server for the Station Manager application.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## API Endpoints

### Employees

- GET `/api/employees` - Get all employees
- POST `/api/employees` - Create a new employee
- PUT `/api/employees/:id` - Update an employee by ID
- DELETE `/api/employees/:id` - Delete an employee by ID

## Requirements

- Node.js
- MongoDB
