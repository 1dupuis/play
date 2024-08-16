document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');

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
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async function submitForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        showStatus('Sending message...', 'info');

        const url = 'https://mail-sender-api1.p.rapidapi.com/';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'mail-sender-api1.p.rapidapi.com',
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

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
            
            if (response.ok) {
                showStatus('Thank you for your message! We will get back to you soon.', 'success');
                form.reset();
            } else {
                showStatus('There was an error sending your message. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showStatus('There was an error sending your message. Please try again later.', 'error');
        }
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
