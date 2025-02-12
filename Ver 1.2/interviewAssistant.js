import fetch from 'node-fetch';

class InterviewAssistant {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
    }

    async generateInterviewQuestions(role, level, category, skills = '', experience = '') {
        try {
            const prompt = this.createPrompt(role, level, category, skills, experience);
            const response = await this.callGeminiAPI(prompt);
            return this.formatResponse(response);
        } catch (error) {
            console.error('Error generating interview questions:', error);
            throw new Error('Failed to generate interview questions');
        }
    }

    createPrompt(role, level, category, skills = '', experience = '') {
        let prompt = `Generate ${category} interview questions for a ${level} ${role} position.\n`;
        
        if (skills) {
            prompt += `Focus on these skills and technologies: ${skills}\n`;
        }
        
        if (experience) {
            prompt += `Consider this background: ${experience}\n`;
        }
        
        prompt += `Include:
            - ${level === 'Intern' ? '2 basic' : '3'} technical questions with detailed answers
            - ${level !== 'Intern' ? '2 system design scenarios if applicable\n' : ''}
            - 2 behavioral questions with example good responses
            - Specific tips for ${level} level candidates
            - Key points to emphasize during the interview
            Format the response in a clear, structured way.`;
        
        return prompt;
    }

    async callGeminiAPI(prompt) {
        try {
            console.log('Calling Gemini API...');
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error:', errorData);
                throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorData}`);
            }

            const data = await response.json();
            console.log('API Response received');

            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                throw new Error('Invalid response format from API');
            }

            return data;
        } catch (error) {
            console.error('Error in callGeminiAPI:', error);
            throw error;
        }
    }

    formatResponse(response) {
        // Process and format the API response
        return response.candidates[0].content.parts[0].text;
    }
}

export { InterviewAssistant };