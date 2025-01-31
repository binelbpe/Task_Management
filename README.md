# Agent Management & List Distribution System

## Project Overview

This MERN (MongoDB, Express.js, React.js, Node.js) stack application is a comprehensive agent management system with features for user authentication, agent creation, and list distribution.

### Key Features

- 🔐 Secure Admin Login 
- 👥 Agent Creation & Management
- 📄 CSV File Upload and Distribution
- 🔒 JWT-based Authentication
- 📊 Intelligent List Allocation

## Technology Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- Shadcn UI Components
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- Express Validator

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
JWT_SECRET=your_jwt_secret_here
PORT=5000
DB_URI=your_mongodb_connection_string
```

### 3. Frontend Setup

1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

### 4. Create Admin User

In the backend directory, run:
```bash
npm run create-admin
```

## Running the Application

### Start Backend Server
In the `backend` directory:
```bash
npm run dev
```
- Server will run on `http://localhost:5000`

### Start Frontend Development Server
In the `frontend` directory:
```bash
npm run dev
```
- Frontend will run on `http://localhost:5173`

## Application Workflow

1. **Login**: 
   - Access admin login page
   - Enter credentials
   - Upon successful authentication, redirect to dashboard

2. **Agent Management**:
   - Create new agents
   - Specify name, email, mobile number, and password

3. **List Distribution**:
   - Upload CSV/XLSX files
   - System validates file format
   - Automatically distributes items equally among 5 agents
   - View distributed lists per agent

## File Upload Specifications

- Supported Formats: CSV, XLSX, XLS
- Validation Rules:
  - Required Columns: FirstName, Phone, Notes
  - Phone must be a valid number
  - Maximum file size: 5MB

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation
- Protected routes

## Error Handling

- Comprehensive error messages
- Validation errors for form submissions
- Authentication failure notifications

## Deployment Considerations

- Use environment-specific configurations
- Set strong JWT secret
- Configure CORS
- Implement proper MongoDB connection management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the ISC License.

## Contact

Your Name - binel biju .binelbpe@gmail.com

Project Link: [https://github.com/binelbpe/Task_Management]
