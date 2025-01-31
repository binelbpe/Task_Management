import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const createAdmin = async (req, res) => {
    try {
        const { username, email, Phone, password, } = req.body;
        console.log('req.body>>', req.body);



        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered' });
        }


        const admin = new Admin({
            username,
            email,
            password,
            Phone
        });

        await admin.save();

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({ token, success: true, message: "User Registered successfully", });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ token, success: true, message: "User login successfully", });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}