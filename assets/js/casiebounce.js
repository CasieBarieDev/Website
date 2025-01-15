const elements = {
    pluginVersion: document.getElementById("version"),
    type: document.getElementById("type"),
    rounded: document.getElementById("rounded"),
    format: document.getElementById("format"),
    nameFormat: document.getElementById("name-format"),
    region: document.getElementById("with-region"),
    regionName: document.getElementById("region-name"),
    worldName: document.getElementById("world-name"),
    position: document.getElementById("position"),
    result: document.getElementById("result"),
    preview: document.getElementById("preview")
}; let isOldVersion = false;
const initializeSelections = () => {
    elements.pluginVersion.selectedIndex = 1;
    elements.type.selectedIndex = 0;
    elements.rounded.checked = false;
    elements.region.checked = false;
    elements.format.selectedIndex = -1;
    elements.nameFormat.selectedIndex = -1;
}; initializeSelections();

const toggleElement = (element, isDisabled, resetValue = '') => {
    element.disabled = isDisabled;
    if(isDisabled) {element.value = resetValue;}
};

const handleVersionChange = () => {
    isOldVersion = elements.pluginVersion.selectedIndex === 1;
    handleFormatChange();
    validateForm();
    updateText();
};

const handleTypeChange = () => {
    const isTotal = elements.type.value === "Total";
    const isLeaderboard = elements.type.value === "Leaderboard";
    toggleElement(elements.format, isTotal);
    toggleElement(elements.position, !isLeaderboard, '');
    document.querySelectorAll("#format option").forEach(opt => {opt.hidden = opt.value === "Name" && !isLeaderboard;});
    handleFormatChange();
    validateForm();
    updateText();
};

const handleFormatChange = () => {
    const isNumberFormat = elements.format.value === "Number";
    const isNameFormat = elements.format.value === "Name";
    toggleElement(elements.rounded, isNameFormat || elements.type.value === "Number", "false");
    toggleElement(elements.nameFormat, isNumberFormat || elements.type.value === "Total" || isOldVersion, "-1");
    validateForm();
    updateText();
};

const handleRegionChange = () => {
    const isRegionChecked = elements.region.checked;
    toggleElement(elements.regionName, !isRegionChecked);
    toggleElement(elements.worldName, !isRegionChecked);
    validateForm();
    updateText();
};

const validateForm = () => {
    const allInputs = document.querySelectorAll('form input, form select');
    allInputs.forEach(input => {
        input.classList.toggle("invalid", !input.disabled && (!input.value || !input.checkValidity()));
        input.classList.toggle("valid", !(!input.disabled && (!input.value || !input.checkValidity())));
    });
    updateText();
};

const updateText = () => {
    let output = "%cb_";
    let previewText = "";
    output += elements.type.value.toLowerCase();
    if(elements.region.checked) {output += `region_${elements.regionName.value}:${elements.worldName.value}_`;
    } else {output += "_";}
    if(elements.type.value === "Leaderboard") {output += `${elements.position.value}_`;}
    output += elements.format.value.toUpperCase();
    if(elements.nameFormat.value) {output += `-${elements.nameFormat.value.toUpperCase()}`;}
    if(elements.format.value !== "Number" && elements.type.value !== "Total") {
        if(elements.nameFormat.value === "Displayname") {previewText += "[OWNER] ";}
        previewText += "CasieBarie";
        if(elements.format.value === "Both") {previewText += ":";}
    } if(elements.type.value !== "Total") {output += "-";}
    if(elements.rounded.checked) {
        output += "ROUNDED%";
        previewText += " 3.7k";
    } else {
        output += "FULL%";
        previewText += " 3745";
    }
    const allValid = ![...document.querySelectorAll('form input, form select')].some(input => input.classList.contains("invalid"));
    if(allValid) {
        elements.result.innerHTML = `<code class='copy'>${output}</code>`;
        elements.result.classList.remove("invalid");
        elements.preview.innerHTML = previewText;
        elements.preview.classList.remove("invalid");
    } else {
        elements.result.innerHTML = "INVALID";
        elements.result.classList.add("invalid");
        elements.preview.innerHTML = "INVALID";
        elements.preview.classList.add("invalid");
    } copy();
};

elements.pluginVersion.addEventListener("change", handleVersionChange);
elements.type.addEventListener("change", handleTypeChange);
elements.format.addEventListener("change", handleFormatChange);
elements.region.addEventListener("change", handleRegionChange);
elements.rounded.addEventListener("change", validateForm);
elements.regionName.addEventListener("input", validateForm);
elements.worldName.addEventListener("input", validateForm);
elements.position.addEventListener("input", validateForm);
elements.nameFormat.addEventListener("change", validateForm);
handleVersionChange();
handleTypeChange();
handleRegionChange();