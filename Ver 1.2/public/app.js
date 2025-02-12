document.addEventListener('DOMContentLoaded', () => {
    const showRolesBtn = document.getElementById('showRolesBtn');
    const rolesList = document.getElementById('rolesList');
    const roleInput = document.getElementById('role');

    // Toggle roles list
    showRolesBtn.addEventListener('click', () => {
        rolesList.classList.toggle('hidden');
    });

    // Handle role selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            roleInput.value = card.dataset.role;
            rolesList.classList.add('hidden');
        });
    });

    // Form submission
    document.getElementById('interviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            role: document.getElementById('role').value,
            level: document.getElementById('level').value,
            category: document.getElementById('category').value,
            skills: document.getElementById('skills').value,
            experience: document.getElementById('experience').value
        };

        console.log('Submitting form with:', formData);

        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('result').classList.add('hidden');

        try {
            const response = await fetch('/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
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
}); 