import { body, validationResult } from 'express-validator';

export const validateAdmin = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
];

export const validateAgent = [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('mobile').matches(/^\d{10}$/).withMessage('Invalid mobile number format'),
    body('password').isLength({ min: 6 }),
];

export const validate = (req, res, next) => {
    
    const errors = validationResult(req);
    console.log('validate init>>>',errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};