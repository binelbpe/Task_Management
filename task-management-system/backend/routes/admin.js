import express from 'express';

import { validateAdmin, validate } from '../middleware/validation.js';
import { createAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/signup', validateAdmin, validate, createAdmin);

router.post('/login', validateAdmin, validate, loginAdmin);

export default router; 