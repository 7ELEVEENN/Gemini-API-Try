import dotenv from 'dotenv';
import express from 'express';
import { InterviewAssistant } from './interviewAssistant.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const interviewAssistant = new InterviewAssistant();

app.post('/generate-questions', async (req, res) => {
    try {
        const { role, level, category } = req.body;
        
        if (!role || !level || !category) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        console.log('Generating questions for:', { role, level, category });
        
        const questions = await interviewAssistant.generateInterviewQuestions(
            role, 
            level, 
            category
        );
        
        console.log('Questions generated successfully');
        res.json({ success: true, questions });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});