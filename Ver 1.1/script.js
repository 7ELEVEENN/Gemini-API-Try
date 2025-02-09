const API_KEY = 'AIzaSyAOCm8ZxPQ7Qjz1l933dwivvYFPJDrQIwc';
const MODEL_NAME = 'gemini-pro';

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error generating the response.';
    }
}

function getFormattedTime() {
    const now = new Date();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const month = monthNames[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    return `${month}/${day}/${year} ${time}`;
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    // Add timestamp
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = getFormattedTime();
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon';
    iconDiv.innerHTML = isUser ? 
        '<i class="fas fa-user"></i>' : 
        '<i class="fas fa-robot"></i>';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    messageDiv.appendChild(timestampDiv);
    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(textDiv);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function handleSend() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    // Disable input and button while processing
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    addMessage(prompt, true);
    userInput.value = '';

    // Get and add AI response
    const response = await generateResponse(prompt);
    addMessage(response);

    // Re-enable input and button
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// Event listeners
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});
