
import Agent from '../models/Agent.js';
import Distribution from '../models/Distribution.js';


export const createAgent = async (req, res) => {
    try {
        const agent = new Agent(req.body);
        await agent.save();
        res.status(201).json(agent);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

export const getAgent= async (req, res) => {
    try {
        const agents = await Agent.find().select('-password');
        res.json(agents);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const updateAgent = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'mobile', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        updates.forEach(update => agent[update] = req.body[update]);
        await agent.save();
        res.json(agent);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const deleteAgent = async (req, res) => {
    try {
        const agent = await Agent.findByIdAndDelete(req.params.id);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}



export const getAgentTasks = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('agentId>>',id);
        

        const agent = await Agent.findById(id);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        const tasks = await Distribution.find({ assignedTo: id });
        
        console.log('tasks>>',tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching agent tasks:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
