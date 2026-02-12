document.getElementById("age").innerText = calcAge() + "";

function calcAge() {
    const diff = Date.now() - new Date("2004-06-08").getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

const form = document.querySelector("form");
const inputs = document.querySelectorAll(".form input, .form textarea, .form select");
const submitBtn = document.getElementById("submit-btn");
const discordInput = document.querySelector("input[name='Discord']");
const emailInput = document.querySelector("input[name='Email']");
const statusMsg = document.createElement("p");

statusMsg.className = "form-status";
statusMsg.textContent = "";
statusMsg.style.opacity = "0";
statusMsg.style.transition = "opacity 0.4s ease";
form.appendChild(statusMsg);

// Setup counters
function setupCounters() {
    const counters = new Map();

    inputs.forEach(input => {
        const max = Number(input.maxLength);
        if(!max || max <= 0) {return;}

        const label = document.querySelector(`label[for='${input.id}']`);
        if(!label) {return;}

        let counter = label.querySelector(".count");
        if(!counter) {
            counter = document.createElement("span");
            counter.className = "count";
            label.appendChild(counter);
        }

        counter.textContent = `${input.value.length}/${max}`;
        counters.set(input, { counter, max });
    }); return counters;
}

const counters = setupCounters();

// Validation functions
function checkForm() {
    const canSubmit = Array.from(inputs).every(i => i.checkValidity() || !i.required);
    submitBtn.classList.toggle("enabled", canSubmit);
}

function validateInput(e) {
    const input = e.target;
    const val = input.value || "";
    const valid = input.checkValidity();

    if(val.trim() === "") {input.classList.remove("valid", "invalid");
    } else {
        input.classList.toggle("valid", valid);
        input.classList.toggle("invalid", !valid);
    }

    const entry = counters.get(input);
    if(entry) {
        const { counter, max } = entry;
        counter.textContent = `${val.length}/${max}`;
        counter.style.color = val.length > max ? "var(--error-color, #ef4444)" : "";
    } checkForm();
}

function validateEmailDiscord() {
    const emailValid = emailInput.value.trim() && emailInput.checkValidity();
    const discordValid = discordInput.value.trim() && discordInput.checkValidity();
    emailInput.required = !discordValid;
    discordInput.required = !emailValid;
    validateInput({ target: this });
}

inputs.forEach(i => i.addEventListener("input", validateInput));
emailInput.addEventListener("input", validateEmailDiscord);
discordInput.addEventListener("input", validateEmailDiscord);

// Status message functions
let statusClearTimeout = null;
function showStatus(message, color) {
    if(statusClearTimeout) {clearTimeout(statusClearTimeout);}
    statusMsg.textContent = message;
    statusMsg.style.color = color;
    statusMsg.style.opacity = "1";

    statusClearTimeout = setTimeout(() => {
        statusMsg.style.opacity = "0";
        statusClearTimeout = null;
    }, 5000);
}

// Reset function
function resetForm() {
    form.reset();
    inputs.forEach(i => validateInput({ target: i }));
    checkForm();
}

// Submit handler
submitBtn.addEventListener("click", async () => {
    if(!submitBtn.classList.contains("enabled")) {
        submitBtn.style.animation = 'shake 0.2s';
        if(navigator.vibrate) {navigator.vibrate(300);}
        setTimeout(() => submitBtn.style.animation = '', 500);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showStatus("", "");

    const token = await grecaptcha.enterprise.execute('6LeHyfYrAAAAAKSqIGfSItFsaG8tjpcv6JP_rmDh', { action: 'submit' });
    const PROXY_URL = "https://websitecontactform.barcas2004.workers.dev/";
    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        discord: document.getElementById("discord").value.trim(),
        topic: document.getElementById("topics").value,
        message: document.getElementById("message").value.trim(),
        honeypot: form.querySelector("[name='honeypot']").value,
        token
    }; if(data.honeypot) {showStatus("❌ Failed to send message. Please try again.", "#ef4444"); return;}

    try {
        const res = await fetch(PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if(res.ok) {
            resetForm();
            showStatus("✅ Your message has been sent successfully!", "#22c55e");
        } else if(res.status === 429) {showStatus("⚠️ You’re sending messages too fast. Try again later.", "#facc15");}
        else if(res.status === 403) {showStatus("⚠️ reCAPTCHA failed. Try again later.", "#facc15");}
        else {showStatus("❌ Failed to send message. Please try again.", "#ef4444");}
    } catch(err) {
        console.error("Network error caught:", err);
        showStatus("❌ Network error. Please try again.", "#ef4444");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    }
});

window.addEventListener("beforeunload", resetForm);
inputs.forEach(i => validateInput({ target: i }));