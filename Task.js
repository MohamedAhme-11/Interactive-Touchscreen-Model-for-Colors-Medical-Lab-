document.addEventListener('DOMContentLoaded', () => {
    const userArrayKey = 'users';
    const formContainer = document.getElementById('form-container');
    const questionContainer = document.getElementById('question-container');
    const thanksContainer = document.getElementById('thanks-container');
    const steps = document.querySelectorAll('.step');

    const next1 = document.getElementById('submit');
    const next2 = document.querySelectorAll('.option');

    // Load data from local storage
    const users = JSON.parse(localStorage.getItem(userArrayKey)) || [];

    // Populate input fields with the last user's data if available
    if (users.length > 0) {
        const lastUser = users[users.length - 1];
        document.getElementById('name').value = lastUser.name || '';
        document.getElementById('email').value = lastUser.email || '';
        document.getElementById('number').value = lastUser.number || '';
    }

    let selectedQuestion = '';

    next1.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;

        if (name && email && number) {
            // Show question container
            formContainer.style.display = 'none';
            questionContainer.style.display = 'block';
            updateStepIndicator(2);
        } else {
            alert('Please fill in all fields');
        }
    });

    next2.forEach(option => {
        option.addEventListener('click', () => {
            selectedQuestion = option.getAttribute('data-question'); // Store the selected question
            showPopup(option.getAttribute('data-question'));
        });
    });

    document.getElementById('popup').addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;

        if (name && email && number && selectedQuestion) {
            const newUser = { name, email, number, question: selectedQuestion };
            users.push(newUser);
            localStorage.setItem(userArrayKey, JSON.stringify(users));

            // Clear input fields after saving data
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('number').value = '';

            questionContainer.style.display = 'none';
            thanksContainer.style.display = 'flex';
            updateStepIndicator(3);
        } else {
            alert('Please fill in all fields and select a question');
        }
    });

    document.getElementById('export').addEventListener('click', () => {
        exportToExcel(users, 'users_data.xlsx');
    });

    document.getElementById('reload').addEventListener('click', () => {
        location.reload();
    });

    function updateStepIndicator(step) {
        steps.forEach((el, index) => {
            el.classList.remove('active');
            if (index < step) {
                el.classList.add('active');
            }
        });
    }

    function exportToExcel(data, filename) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, filename);
    }

    window.showPopup = function(option) {
        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popup-text');
        
        let text;
        if (option === 'prevotella') {
            text = "Your predominant Gut microbiota is Prevotella. Knowing your Gut-microbiota composition makes you better understand your enterotype personalized nutrition and how to limit its associated disease risk factors.";
        } else if (option === 'bacteroides') {
            text = "Your predominant Gut microbiota is Bacteroides. Knowing your Gut-microbiota composition makes you better understand your enterotype personalized nutrition and how to limit its associated disease risk factors.";
        } else if (option === 'ruminococcus') {
            text = "Your predominant Gut microbiota is Ruminococcus. Knowing your Gut-microbiota composition makes you better understand your enterotype personalized nutrition and how to limit its associated disease risk factors.";
        }

        popupText.innerText = text;
        popup.style.display = "block";
    }

    window.closePopup = function() {
        document.getElementById('popup').style.display = "none";
    }
});
