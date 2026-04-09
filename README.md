# College Library Management System

A full-stack MERN (MongoDB, Express, React, Node.js) library management system for colleges with modern UI using shadcn/ui and dark/light mode support.

## Features

- **Authentication**: JWT-based login/register system
- **Role-based access**: Admin and Student roles
- **Book Management**: Add, edit, delete, search books
- **Student Management**: View student records
- **Transaction Management**: Issue and return books
- **Dashboard**: View library statistics
- **Dark/Light Mode**: Toggle between themes
- **Modern UI**: Clean design with shadcn/ui components

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui, React Router
- **Backend**: Node.js, Express, MongoDB, JWT
- **Styling**: Tailwind CSS with custom theme variables

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/library_management
# JWT_SECRET=your_secret_key

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

### 3. Run Both (from root)

```bash
npm run dev
```

## Default Admin Account

Register a new account and select "Admin" as the role, or create one manually in MongoDB:

```javascript
{
  name: "Admin",
  email: "admin@college.edu",
  password: "admin123", // hashed with bcrypt
  role: "admin"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/user` - Get current user
- `GET /api/auth/users` - Get all users (admin only)

### Books
- `GET /api/books` - Get all books (with search)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/issue` - Issue book (admin only)
- `POST /api/transactions/return` - Return book (admin only)
- `GET /api/transactions/stats` - Get statistics (admin only)

## Project Structure

```
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn components
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ModeToggle.jsx
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── package.json
└── README.md
```
"# library-management" 
