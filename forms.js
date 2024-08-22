// Define premade forms
const premadeForms = [
    premadeForm('First Form!', [
        { type: 'multiple', question: 'Do you like dupuis.lol?', options: ['Yes', 'No', 'Not Sure'] },
        { type: 'short', question: 'What is your favorite feature?' }
    ])
];

// Function to define premade forms
function premadeForm(name, questions) {
    return {
        formTitle: name,
        questions: questions
    };
}

// Populate form selection dropdown
function populateFormSelection(forms) {
    const formSelection = document.getElementById('form-selection');
    formSelection.innerHTML = '<option value="">Select a Form</option>'; // Initial option

    forms.forEach(form => {
        const option = document.createElement('option');
        option.value = form.formTitle;
        option.textContent = form.formTitle;
        formSelection.appendChild(option);
    });
}

// Load the selected premade form
function loadSelectedForm() {
    const formSelection = document.getElementById('form-selection');
    const selectedFormTitle = formSelection.value;
    const form = premadeForms.find(f => f.formTitle === selectedFormTitle);
    const formBuilder = document.getElementById('form-builder');
    formBuilder.innerHTML = '';

    if (!form) {
        document.getElementById('form-status').innerText = ''; // Clear status message
        document.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    // Check if the form has been previously submitted
    if (isFormSubmitted(selectedFormTitle)) {
        formBuilder.innerHTML = '<p class="status-message">You have already submitted this form.</p>';
        document.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    form.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.id = `question-${index + 1}`;
        
        const label = document.createElement('label');
        label.className = 'question-label';
        label.innerText = question.question;
        
        let input;
        switch (question.type) {
            case 'multiple':
                input = document.createElement('select');
                input.name = `question-${index + 1}`;
                input.required = true;
                question.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    input.appendChild(option);
                });
                break;
            case 'long':
                input = document.createElement('textarea');
                input.name = `question-${index + 1}`;
                input.placeholder = 'Enter your long answer here';
                input.rows = 4;
                input.required = true;
                break;
            case 'number':
                input = document.createElement('input');
                input.type = 'number';
                input.name = `question-${index + 1}`;
                input.placeholder = 'Enter a number';
                input.required = true;
                break;
            case 'date':
                input = document.createElement('input');
                input.type = 'date';
                input.name = `question-${index + 1}`;
                input.required = true;
                break;
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.name = `question-${index + 1}`;
                input.placeholder = 'Enter your answer here';
                input.required = true;
                break;
        }
        
        questionDiv.appendChild(label);
        questionDiv.appendChild(input);
        formBuilder.appendChild(questionDiv);
    });

    // Set hidden field to the current form title
    document.getElementById('formTitle').value = selectedFormTitle;
}

// Check if the form has been submitted
function isFormSubmitted(formTitle) {
    const submittedForms = JSON.parse(localStorage.getItem('submittedForms')) || [];
    return submittedForms.includes(formTitle);
}

// Mark the form as submitted
function markFormAsSubmitted(formTitle) {
    const submittedForms = JSON.parse(localStorage.getItem('submittedForms')) || [];
    if (!submittedForms.includes(formTitle)) {
        submittedForms.push(formTitle);
        localStorage.setItem('submittedForms', JSON.stringify(submittedForms));
    }
}

// Handle form submission
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formSelection = document.getElementById('form-selection').value;
    
    if (!formSelection) {
        document.getElementById('form-status').innerText = 'Please select a form.';
        return;
    }

    if (isFormSubmitted(formSelection)) {
        document.getElementById('form-status').innerText = 'You have already submitted this form.';
        return;
    }

    // Mark the form as submitted
    markFormAsSubmitted(formSelection);

    // Handle form submission to Formspree
    const formData = new FormData(this);
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('form-status').innerText = 'Thank you for your submission!';
            // Optionally, reload the page to prevent re-submission
            setTimeout(() => window.location.reload(), 2000);
        } else {
            document.getElementById('form-status').innerText = 'There was a problem with your submission. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('form-status').innerText = 'There was a problem with your submission. Please try again.';
    });
});

// Initialize form selection dropdown and load form
document.addEventListener('DOMContentLoaded', function() {
    populateFormSelection(premadeForms);
    document.getElementById('form-selection').addEventListener('change', loadSelectedForm);
});
