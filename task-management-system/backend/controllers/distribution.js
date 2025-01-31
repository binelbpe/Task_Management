import csv from 'csv-parser';
import xlsx from 'xlsx';
import fs from 'fs';
import Distribution from '../models/Distribution.js';
import Agent from '../models/Agent.js';


const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
};
const distributeRecords = async (records, agents) => {
    if (!agents.length) {
        throw new Error('No agents available for distribution');
    }

    const distributions = [];
    const baseCount = Math.floor(records.length / agents.length);
    const extraCount = records.length % agents.length;

    let currentIndex = 0;
    for (let i = 0; i < agents.length; i++) {
        const count = i < extraCount ? baseCount + 1 : baseCount;
        const agentRecords = records.slice(currentIndex, currentIndex + count);

        for (const record of agentRecords) {
            distributions.push({
                firstName: record.FirstName,
                phone: record.Phone,
                notes: record.Notes,
                assignedTo: agents[i]._id
            });
        }
        currentIndex += count;
    }

    return distributions;
};

export const uplodDistributeList = async (req, res) => {
    console.log('init uplodDistributeList>>>', req.file);

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let records;
        if (req.file.mimetype === 'text/csv') {
            records = await parseCSV(req.file.path);
        } else {
            records = parseExcel(req.file.path);
        }
        records = records.map(record => 
            Object.fromEntries(
                Object.entries(record).map(([key, value]) => [key.trim(), value])
            )
        );
        console.log('records>>', records);

        if (!records.length) {
            return res.status(400).json({ error: 'No records found in file' });
        }

      
        const agents = await Agent.find();
        if (agents.length === 0) {
            return res.status(400).json({ error: 'No agents available for distribution' });
        }

        console.log('agents>>', agents);

        const distributions = await distributeRecords(records, agents);
        console.log('distributions>>', distributions);
        
        
        await Distribution.insertMany(distributions);

        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Distribution completed successfully',
            totalRecords: records.length,
            distributionSummary: agents.map((agent, index) => ({
                agentName: agent.name,
                assignedCount: distributions.filter(d => d.assignedTo.toString() === agent._id.toString()).length
            }))
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message || 'Server error' });
    }
};


export const getDistribution = async (req, res) => {
    try {
        const distributions = await Distribution.find()
            .populate('assignedTo', 'name email')
            .sort('-createdAt');
        res.json(distributions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

