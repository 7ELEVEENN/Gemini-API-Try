document.getElementById('interviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const level = document.getElementById('level').value;
    const category = document.getElementById('category').value;

    console.log('Submitting form with:', { role, level, category });

    // Show loading spinner
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');

    try {
        const response = await fetch('/generate-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role, level, category })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (data.success) {
            // Format and display the results
            document.getElementById('questions').textContent = data.questions;
            document.getElementById('result').classList.remove('hidden');
        } else {
            alert(`Error: ${data.error || 'Unknown error occurred'}`);
        }
    } catch (error) {
        console.error('Detailed error:', error);
        alert(`Error connecting to the server: ${error.message}`);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}); 