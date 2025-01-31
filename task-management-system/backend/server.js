import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
dotenv.config();


import adminRoutes from './routes/admin.js';
import agentRoutes from './routes/agents.js';
import distributionRoutes from './routes/distribution.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH '], 
    credentials: true 
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/', adminRoutes);
app.use('/agents', agentRoutes);
app.use('/distribution', distributionRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
