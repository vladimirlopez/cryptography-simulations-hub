const CONFIG = {
    sequenceLength: 10,
    bases: ['+', 'x'],
    symbols: {
        '+': { '0': '|', '1': '-' },
        'x': { '0': '\\', '1': '/' }
    }
};

let aliceData = [];
let bobData = [];
let currentStep = 1;

// UI Elements
const aliceBtn = document.getElementById('alice-send-btn');
const bobBtn = document.getElementById('bob-measure-btn');
const siftBtn = document.getElementById('sift-btn');
const resetBtn = document.getElementById('reset-btn');
const photonStream = document.getElementById('photon-stream');
const tableBody = document.getElementById('table-body');
const finalKeyDisplay = document.getElementById('final-key-display');
const stepGuides = document.querySelectorAll('.step-guide');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function init() {
    aliceData = [];
    bobData = [];
    currentStep = 1;

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.toggle('active', b === btn));
            tabContents.forEach(c => c.classList.toggle('active', c.id === `${target}-tab`));
        });
    });

    updateUI();
}

function updateUI() {
    // Update step guide states
    stepGuides.forEach(guide => {
        const step = parseInt(guide.dataset.step);
        guide.classList.toggle('active', step === currentStep);
    });

    // Update buttons
    aliceBtn.disabled = currentStep !== 1;
    bobBtn.disabled = currentStep !== 2;
    siftBtn.disabled = currentStep !== 3;

    // Render Stream and Table
    renderStream();
    renderTable();
}

function renderStream() {
    if (aliceData.length === 0) {
        photonStream.innerHTML = '<div class="empty-state">Click "Alice Sends Photons" to begin.</div>';
        return;
    }

    photonStream.innerHTML = '';
    aliceData.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'photon-row';

        const bobItem = bobData[i];

        row.innerHTML = `
            <div class="photon-pair">
                <div class="photon-box active">
                    <span class="photon-icon">${CONFIG.symbols[item.basis][item.bit]}</span>
                    <span class="photon-meta">${item.basis} (${item.bit})</span>
                </div>
            </div>
            <div class="photon-pair">
                <div class="photon-box ${bobItem ? 'active' : ''}">
                    ${bobItem ? `
                        <span class="photon-icon">${CONFIG.symbols[bobItem.basis][bobItem.result]}</span>
                        <span class="photon-meta">${bobItem.basis} (${bobItem.result})</span>
                    ` : '?'}
                </div>
            </div>
        `;
        photonStream.appendChild(row);
    });
}

function renderTable() {
    tableBody.innerHTML = '';
    aliceData.forEach((item, i) => {
        const bobItem = bobData[i];
        const isSifted = currentStep >= 4;
        const match = bobItem && item.basis === bobItem.basis;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.basis}</td>
            <td>${item.bit}</td>
            <td>${bobItem ? bobItem.basis : '-'}</td>
            <td>${bobItem ? bobItem.result : '-'}</td>
            <td>${bobItem && currentStep >= 3 ? (match ? '<span class="match-yes">YES</span>' : '<span class="match-no">NO</span>') : '-'}</td>
            <td>${isSifted && match ? `<span class="final-key-bit">${item.bit}</span>` : '-'}</td>
        `;
        tableBody.appendChild(tr);
    });

    if (currentStep === 4) {
        const key = aliceData
            .filter((item, i) => bobData[i] && item.basis === bobData[i].basis)
            .map(item => item.bit)
            .join('');
        finalKeyDisplay.textContent = key || 'No matching bases found!';
    } else {
        finalKeyDisplay.textContent = '';
    }
}

aliceBtn.addEventListener('click', () => {
    aliceData = Array.from({ length: CONFIG.sequenceLength }, () => ({
        bit: Math.floor(Math.random() * 2).toString(),
        basis: CONFIG.bases[Math.floor(Math.random() * 2)]
    }));
    currentStep = 2;
    updateUI();
});

bobBtn.addEventListener('click', () => {
    bobData = aliceData.map(alice => {
        const basis = CONFIG.bases[Math.floor(Math.random() * 2)];
        let result;
        if (basis === alice.basis) {
            result = alice.bit;
        } else {
            // Mismatch: 50/50 chance
            result = Math.floor(Math.random() * 2).toString();
        }
        return { basis, result };
    });
    currentStep = 3;
    updateUI();
});

siftBtn.addEventListener('click', () => {
    currentStep = 4;
    updateUI();
});

resetBtn.addEventListener('click', init);

init();
