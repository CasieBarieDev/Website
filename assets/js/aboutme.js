document.getElementById('age').innerText = "" + calcAge();
function calcAge() {
    const ageDifMs = Date.now() - new Date('06/08/2004').getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const $inputs = $("input[name='Discord'], input[name='Email']");
const $submitBtn = $('#submit-btn');
const $allInputs = $('.form input, .form textarea, .form select');

function checkForm() {
    const canSubmit = $allInputs.toArray().every(input => input.checkValidity() || !$(input).prop('required'));
    $submitBtn.toggleClass('enabled', canSubmit);
}

function validateInput() {
    const $this = $(this);
    const isValid = this.checkValidity();

    if($this.val().trim() !== '') {$this.toggleClass('valid', isValid).toggleClass('invalid', !isValid);
    } else {$this.removeClass('valid invalid');}

    $this.siblings('.count').text(`${$this.val().length}/${$this.attr('maxlength') || ''}`);
    checkForm();
}

$inputs.on('input', function () {
    const $email = $("input[name='Email']");
    const $discord = $("input[name='Discord']");
    const emailValid = $email.val().trim() !== '' && $email[0].checkValidity();
    const discordValid = $discord.val().trim() !== '' && $discord[0].checkValidity();
    $email.prop('required', !discordValid);
    $discord.prop('required', !emailValid);
    validateInput.call(this);
});

$allInputs.on('input', validateInput);

$submitBtn.on('click', function () {
    if($submitBtn.hasClass('enabled')) {
        $('form')[0].submit();
    } else {
        $submitBtn.css('animation', 'shake 0.2s');
        if(navigator.vibrate) navigator.vibrate(300);
        setTimeout(() => $submitBtn.css('animation', ''), 500);
    }
});

window.onbeforeunload = function () {
    $('form')[0].reset();
    $allInputs.each(function () { validateInput.call(this); });
    checkForm();
};

$allInputs.each(function () { validateInput.call(this); });