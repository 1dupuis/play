document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!fullName || !email || !subject || !message) {
            showStatus('Please fill out all required fields.', 'error');
            return false;
        }

        if (!isValidEmail(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    async function submitForm() {
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        showStatus('Sending message...', 'info');
        submitButton.disabled = true; // Prevent multiple submissions

        try {
            // Try to send using the primary API
            await sendEmailWithAPI('https://mail-sender-api1.p.rapidapi.com/', formData);
            showStatus('Thank you for your message! We will get back to you soon.', 'success');
            form.reset();
        } catch (primaryError) {
            console.error('Primary API Error:', primaryError);
            showStatus('Primary service failed, trying secondary...', 'info');

            try {
                // Try to send using the secondary API
                await sendEmailWithAPI('https://rapidmail.p.rapidapi.com/', formData);
                showStatus('Thank you for your message! We will get back to you soon.', 'success');
                form.reset();
            } catch (secondaryError) {
                console.error('Secondary API Error:', secondaryError);
                showStatus('There was an error sending your message. Please try again later.', 'error');
            }
        } finally {
            submitButton.disabled = false; // Re-enable the submit button
        }
    }

    async function sendEmailWithAPI(url, { fullName, email, subject, message }) {
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': url.includes('mail-sender') ? 'mail-sender-api1.p.rapidapi.com' : 'rapidmail.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sendto: 'contact.dupuis.lol@gmail.com',
                name: fullName,
                replyTo: email,
                ishtml: 'false',
                title: subject,
                body: message
            })
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`API responded with status ${response.status}: ${errorDetails}`);
        }

        return response.text();
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `fade-in ${type}`;
        statusMessage.classList.remove('hidden');

        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
});
