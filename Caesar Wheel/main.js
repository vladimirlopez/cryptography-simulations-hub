const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let currentShift = 3;
let isEncoding = true;
let isDragging = false;
let startAngle = 0;

// DOM Elements
const messageInput = document.getElementById('message-input');
const shiftSlider = document.getElementById('shift-slider');
const shiftValueDisplay = document.getElementById('shift-value');
const modeEncodeBtn = document.getElementById('mode-encode');
const modeDecodeBtn = document.getElementById('mode-decode');
const outputText = document.getElementById('output-text');
const outputLabel = document.getElementById('output-label');
const wheelSvg = document.getElementById('caesar-wheel-svg');
const charCurrent = document.getElementById('char-current');
const btnCopy = document.getElementById('btn-copy');

// Modals
const modalLearn = document.getElementById('modal-learn');
const modalChallenge = document.getElementById('modal-challenge');
const btnLearn = document.getElementById('btn-learn');
const btnChallenge = document.getElementById('btn-challenge');
const closeButtons = document.querySelectorAll('.close-modal');

// Challenge
const challengeCipher = document.getElementById('challenge-cipher');
const challengeInput = document.getElementById('challenge-input');
const btnSubmitChallenge = document.getElementById('btn-submit-challenge');
const challengeFeedback = document.getElementById('challenge-feedback');
const hintShift = document.getElementById('hint-shift');

const challenges = [
    { cipher: "KHOOR ZRUOG", shift: 3, answer: "HELLO WORLD" },
    { cipher: "GR QRW WUXVW BRXU BHV", shift: 3, answer: "DO NOT TRUST YOUR EYES" },
    { cipher: "AXGZ PZKDA", shift: 6, answer: "STAY SHARP" }
];
let currentChallengeIndex = 0;

// Initialize
function init() {
    renderWheel();
    updateOutput();
    setupEventListeners();
}

function caesarCipher(text, shift, encode = true) {
    if (!encode) shift = (26 - shift) % 26;

    return text.toUpperCase().split('').map(char => {
        const index = ALPHABET.indexOf(char);
        if (index === -1) return char;
        return ALPHABET[(index + shift) % 26];
    }).join('');
}

function updateOutput() {
    const text = messageInput.value;
    const result = caesarCipher(text, currentShift, isEncoding);
    outputText.textContent = result || "Result will appear here...";
    charCurrent.textContent = text.length;

    if (text.length > 120) {
        messageInput.value = text.substring(0, 120);
        charCurrent.textContent = 120;
    }
}

function renderWheel() {
    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 130;

    let svgContent = '';

    // Outer Wheel (Fixed)
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" fill="var(--wheel-outer)" stroke="var(--border-color)" stroke-width="2" />`;

    // Outer Letters (Fixed)
    for (let i = 0; i < 26; i++) {
        const angle = (i * (360 / 26)) - 90;
        const rad = angle * (Math.PI / 180);
        const ox = centerX + (outerRadius - 25) * Math.cos(rad);
        const oy = centerY + (outerRadius - 25) * Math.sin(rad);
        svgContent += `<text x="${ox}" y="${oy}" text-anchor="middle" dominant-baseline="middle" fill="var(--text-main)" font-family="var(--font-mono)" font-weight="bold" font-size="14">${ALPHABET[i]}</text>`;
    }

    // Label for Outer Ring (Ciphertext) - Placed at bottom to avoid top letters
    svgContent += `
        <defs>
            <path id="outerLabelPath" d="M ${centerX - 170},${centerY} a 170,170 0 0,0 340,0" fill="none" />
        </defs>
        <text font-family="var(--font-body)" font-size="8" font-weight="bold" fill="var(--text-dim)" opacity="0.3">
            <textPath href="#outerLabelPath" startOffset="50%" text-anchor="middle">CIPHERTEXT (OUTER RING)</textPath>
        </text>
    `;

    // Inner Wheel (Rotatable)
    const rotation = -(currentShift * (360 / 26));
    svgContent += `<g id="inner-wheel" style="transform-origin: center; transform: rotate(${rotation}deg); transition: transform 0.3s ease-out;">`;
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" fill="var(--wheel-inner)" stroke="var(--border-color)" stroke-width="2" />`;

    // Draw Inner Letters and division lines
    for (let i = 0; i < 26; i++) {
        const angle = (i * (360 / 26)) - 90;
        const rad = angle * (Math.PI / 180);

        // Division lines
        const lineAngle = ((i + 0.5) * (360 / 26)) - 90;
        const lrad = lineAngle * (Math.PI / 180);
        const lx1 = centerX + innerRadius * Math.cos(lrad);
        const ly1 = centerY + innerRadius * Math.sin(lrad);
        const lx2 = centerX + (innerRadius - 40) * Math.cos(lrad);
        const ly2 = centerY + (innerRadius - 40) * Math.sin(lrad);
        svgContent += `<line x1="${lx1}" y1="${ly1}" x2="${lx2}" y2="${ly2}" stroke="var(--border-color)" stroke-width="1" opacity="0.3" />`;

        // Inner Letters
        const ix = centerX + (innerRadius - 25) * Math.cos(rad);
        const iy = centerY + (innerRadius - 25) * Math.sin(rad);
        // Apply inverse rotation to text to keep it upright
        svgContent += `<text x="${ix}" y="${iy}" text-anchor="middle" dominant-baseline="middle" fill="var(--accent-primary)" font-family="var(--font-mono)" font-weight="bold" font-size="14" transform="rotate(${-rotation}, ${ix}, ${iy})" style="transition: transform 0.3s ease-out;">${ALPHABET[i]}</text>`;
    }

    // Label for Inner Ring (Plaintext) - Placed at bottom
    svgContent += `
        <defs>
            <path id="innerLabelPath" d="M ${centerX - 70},${centerY} a 70,70 0 0,0 140,0" fill="none" />
        </defs>
        <text font-family="var(--font-body)" font-size="8" font-weight="bold" fill="var(--accent-primary)" opacity="0.4" transform="rotate(${-rotation}, ${centerX}, ${centerY})" style="transition: transform 0.3s ease-out;">
            <textPath href="#innerLabelPath" startOffset="50%" text-anchor="middle">PLAINTEXT (INNER RING)</textPath>
        </text>
    `;
    svgContent += `</g>`;

    // Center hole
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="15" fill="var(--bg-dark)" stroke="var(--border-color)" />`;

    wheelSvg.innerHTML = svgContent;
}

function setupEventListeners() {
    messageInput.addEventListener('input', updateOutput);

    shiftSlider.addEventListener('input', (e) => {
        currentShift = parseInt(e.target.value);
        shiftValueDisplay.textContent = currentShift;
        renderWheel();
        updateOutput();
    });

    modeEncodeBtn.addEventListener('click', () => {
        isEncoding = true;
        modeEncodeBtn.classList.add('active');
        modeDecodeBtn.classList.remove('active');
        outputLabel.textContent = "Encoded Message";
        updateOutput();
    });

    modeDecodeBtn.addEventListener('click', () => {
        isEncoding = false;
        modeDecodeBtn.classList.add('active');
        modeEncodeBtn.classList.remove('active');
        outputLabel.textContent = "Decoded Message";
        updateOutput();
    });

    btnCopy.addEventListener('click', () => {
        const text = outputText.textContent;
        if (text && text !== "Result will appear here...") {
            navigator.clipboard.writeText(text);
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "Copied!";
            btnCopy.classList.add('special');
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.classList.remove('special');
            }, 2000);
        }
    });

    // Modals
    btnLearn.addEventListener('click', () => modalLearn.classList.remove('hidden'));
    btnChallenge.addEventListener('click', () => {
        loadChallenge();
        modalChallenge.classList.remove('hidden');
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modalLearn.classList.add('hidden');
            modalChallenge.classList.add('hidden');
        });
    });

    // Wheel Dragging (Simplified rotation)
    wheelSvg.addEventListener('mousedown', startRotate);
    window.addEventListener('mousemove', rotate);
    window.addEventListener('mouseup', endRotate);

    // Challenge logic
    btnSubmitChallenge.addEventListener('click', checkChallenge);
}

function startRotate(e) {
    isDragging = true;
    const rect = wheelSvg.getBoundingClientRect();
    const x = e.clientX - rect.left - 200;
    const y = e.clientY - rect.top - 200;
    startAngle = Math.atan2(y, x);
    wheelSvg.style.cursor = 'grabbing';
}

function rotate(e) {
    if (!isDragging) return;
    const rect = wheelSvg.getBoundingClientRect();
    const x = e.clientX - rect.left - 200;
    const y = e.clientY - rect.top - 200;
    const currentAngle = Math.atan2(y, x);

    let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
    if (Math.abs(angleDiff) > 10) { // Threshold for shift
        const shiftChange = Math.round(angleDiff / (360 / 26));
        if (shiftChange !== 0) {
            currentShift = (currentShift - shiftChange + 26) % 26;
            shiftSlider.value = currentShift;
            shiftValueDisplay.textContent = currentShift;
            startAngle = currentAngle;
            renderWheel();
            updateOutput();
        }
    }
}

function endRotate() {
    isDragging = false;
    wheelSvg.style.cursor = 'grab';
}

function loadChallenge() {
    const challenge = challenges[currentChallengeIndex];
    challengeCipher.textContent = challenge.cipher;
    challengeInput.value = "";
    challengeFeedback.textContent = "";
    hintShift.textContent = currentChallengeIndex === 0 ? "3" : "?";
}

function checkChallenge() {
    const challenge = challenges[currentChallengeIndex];
    const userGuess = challengeInput.value.trim().toUpperCase();

    if (userGuess === challenge.answer) {
        challengeFeedback.innerHTML = "🎉 <span style='color: #3fb950;'>Correct!</span>";
        setTimeout(() => {
            currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
            if (currentChallengeIndex === 0) {
                challengeFeedback.textContent = "You've completed all challenges! Great job.";
            } else {
                loadChallenge();
            }
        }, 2000);
    } else {
        challengeFeedback.innerHTML = "❌ <span style='color: #f85149;'>Try again!</span> Check your shift.";
    }
}

init();
