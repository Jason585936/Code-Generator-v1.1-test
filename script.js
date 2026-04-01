// Elements
const output = document.getElementById("output");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");


// Update slider display
function updateSliderFill() {
    const percent = (lengthSlider.value - lengthSlider.min) / 
                    (lengthSlider.max - lengthSlider.min) * 100;

    requestAnimationFrame(() => {
        lengthSlider.style.background =
            `linear-gradient(to right, #5865f2 ${percent}%, #3a3b40 ${percent}%)`;
    });
}

let currentPercent = 0;

function updateSliderFillSmooth(targetPercent) {
    const speed = 0.15; // lower = smoother (0.1–0.2 is nice)

    currentPercent += (targetPercent - currentPercent) * speed;

    lengthSlider.style.background =
        `linear-gradient(to right, #5865f2 ${currentPercent}%, #3a3b40 ${currentPercent}%)`;

    if (Math.abs(targetPercent - currentPercent) > 0.1) {
        requestAnimationFrame(() => updateSliderFillSmooth(targetPercent));
    }
}

// On drag
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;

    const percent =
        (lengthSlider.value - lengthSlider.min) /
        (lengthSlider.max - lengthSlider.min) * 100;

    updateSliderFillSmooth(percent);
});

// Run once
updateSliderFillSmooth(
    (lengthSlider.value - lengthSlider.min) /
    (lengthSlider.max - lengthSlider.min) * 100
);

updateSliderFill();


// Generate Code
function generateCode() {
    let chars = "";

    if (uppercase.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase.checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers.checked) chars += "0123456789";

    if (!chars) {
        output.value = "Select Options";
        showToast("Select at least one option", "info");
        return;
    }

    const length = parseInt(lengthSlider.value);
    let result = "";

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }

    output.value = result;
}


// Copy Code
function copyCode() {
    const value = output.value.trim();

    if (
        value === "" ||
        value === "Generated code will be here" ||
        value === "Select Options"
    ) {
        showToast("Invalid Copy", "error");
        return;
    }

    output.select();
    document.execCommand("copy");

    showToast("Copied to clipboard", "success");
}


// Toast
function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    // LIMIT to 3 toasts
    const maxToasts = 3;
    if (container.children.length >= maxToasts) {
    const oldest = container.firstChild;

    if (!oldest.classList.contains("removing")) {
        oldest.classList.add("removing");
        removeToast(oldest);
    }
}

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    // Color
    if (type === "success") {
        toast.style.borderLeftColor = "#3ba55d";
    } else if (type === "error") {
        toast.style.borderLeftColor = "#ed4245";
    } else {
        toast.style.borderLeftColor = "#5865f2";
    }

    container.appendChild(toast);

    // Force reflow so animation works
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, 2000);
}


// Smooth remove
function removeToast(toast) {
    if (!toast) return;

    toast.classList.remove("show");
    toast.classList.add("hide");

    // Wait for animation to finish BEFORE removing
    toast.addEventListener("transitionend", () => {
        toast.remove();
    }, { once: true });
}

    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
