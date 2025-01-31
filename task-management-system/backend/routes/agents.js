import express from 'express';
import auth from '../middleware/auth.js';
import { validateAgent, validate } from '../middleware/validation.js';
import { createAgent, deleteAgent, getAgent, getAgentTasks, updateAgent } from '../controllers/agentsController.js';

const router = express.Router();


router.post('/', auth, validateAgent, validate, createAgent );

router.get('/:id/tasks', auth,getAgentTasks );

router.get('/', auth,  getAgent);

router.patch('/:id', auth,updateAgent );


router.delete('/:id', auth, deleteAgent);

export default router;
