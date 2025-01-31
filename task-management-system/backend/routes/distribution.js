import express from 'express';
import { getDistribution, uplodDistributeList } from '../controllers/distribution.js';
import auth from '../middleware/auth.js';
import multer from 'multer';



const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
        }
    }
});

const router = express.Router();

router.post('/upload', auth, upload.single('file'),uplodDistributeList)
router.get('/history', auth,getDistribution)

export default router; 