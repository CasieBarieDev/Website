document.getElementById('age').innerText = calcAge() + "";

function calcAge() {
    const ageDifMs = Date.now() - new Date('06/08/2004').getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const allInputs = document.querySelectorAll('.form input, .form textarea, .form select');
const submitBtn = document.getElementById('submit-btn');
const discordInput = document.querySelector("input[name='Discord']");
const emailInput = document.querySelector("input[name='Email']");

function checkForm() {
    const canSubmit = Array.from(allInputs).every(input => input.checkValidity() || !input.required);
    submitBtn.classList.toggle('enabled', canSubmit);
}

function validateInput(event) {
    const input = event.target;
    const value = input.value || '';
    const isValid = input.checkValidity();

    if(value.trim() !== '') {
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
    } else {input.classList.remove('valid', 'invalid');}

    const countElement = input.nextElementSibling;
    if(countElement && countElement.classList.contains('count')) {countElement.textContent = `${value.length}/${input.maxLength || ''}`;}
    checkForm();
}

function validateEmailDiscord() {
    const emailValid = emailInput.value.trim() !== '' && emailInput.checkValidity();
    const discordValid = discordInput.value.trim() !== '' && discordInput.checkValidity();
    emailInput.required = !discordValid;
    discordInput.required = !emailValid;
    validateInput({ target: this });
}

allInputs.forEach(input => input.addEventListener('input', validateInput));
emailInput.addEventListener('input', validateEmailDiscord);
discordInput.addEventListener('input', validateEmailDiscord);

submitBtn.addEventListener('click', () => {
    if(submitBtn.classList.contains('enabled')) {document.querySelector('form').submit();
    } else {
        submitBtn.style.animation = 'shake 0.2s';
        if (navigator.vibrate) navigator.vibrate(300);
        setTimeout(() => submitBtn.style.animation = '', 500);
    }
});

window.addEventListener('beforeunload', () => {
    document.querySelector('form').reset();
    allInputs.forEach(input => validateInput({ target: input }));
    checkForm();
});

allInputs.forEach(input => validateInput({ target: input }));