const frequencies = {
    en: {
        A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702, F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153, K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507, P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056, U: 2.758, V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
    },
    es: {
        A: 12.525, B: 2.215, C: 4.019, D: 5.002, E: 13.681, F: 0.692, G: 1.008, H: 0.703, I: 6.247, J: 0.443, K: 0.011, L: 4.967, M: 3.157, N: 6.712, O: 8.683, P: 2.510, Q: 0.877, R: 6.871, S: 7.977, T: 4.632, U: 3.927, V: 1.138, W: 0.017, X: 0.215, Y: 1.008, Z: 0.517
    },
    fr: {
        A: 7.636, B: 0.901, C: 3.260, D: 3.669, E: 14.715, F: 1.066, G: 0.866, H: 0.737, I: 7.529, J: 0.613, K: 0.074, L: 5.456, M: 2.968, N: 7.095, O: 5.796, P: 2.521, Q: 1.362, R: 6.693, S: 7.948, T: 7.244, U: 6.311, V: 1.838, W: 0.049, X: 0.427, Y: 0.128, Z: 0.326
    },
    de: {
        A: 6.516, B: 1.886, C: 2.732, D: 5.076, E: 16.396, F: 1.656, G: 3.009, H: 4.577, I: 6.550, J: 0.268, K: 1.417, L: 3.437, M: 2.534, N: 9.776, O: 2.594, P: 0.670, Q: 0.018, R: 7.003, S: 7.270, T: 6.154, U: 4.166, V: 0.846, W: 1.921, X: 0.034, Y: 0.039, Z: 1.134
    }
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let substitutions = {};
alphabet.forEach(char => substitutions[char] = '');
let sortByFrequency = false;

const select = document.getElementById('language-select');
const inputText = document.getElementById('input-text');
const standardChart = document.getElementById('standard-chart');
const messageChart = document.getElementById('message-chart');
const substitutionGrid = document.getElementById('substitution-grid');
const decodedDisplay = document.getElementById('decoded-display');
const langLabel = document.getElementById('current-lang-label');
const resetBtn = document.getElementById('reset-btn');
const sampleBtn = document.getElementById('sample-btn');
const copyBtn = document.getElementById('copy-btn');
const sortBtn = document.getElementById('sort-btn');

const samples = {
    en: "YKTJXTFEN QFQSNLOL OL WQLTR GF ZIT YQEZ ZIQZ, IN QFN UOVTF LZKTZII GY VKIZZTF SQFUXQUT, ETKZQIF STZZTKL QFR EGDWOFQZOGFL GY STZZTKL GEEXK VOZI CQKNIFU YKTJXTFETL. DGKTGCTK, ZITKT OL Q EIQKQEZTKOLZIT ROLZKOXXZOGF GY STZZTKL ZIQZ OL KGXUISH ZIT LQDT YGK QSDGLZ QSS LQDHSLS GY ZIQZ SQFUXQUT.",
    es: "TS QFQSNLOL RT YKTETFEIOQ LT WQLQ TF TS IEIOG RT JXT, TF EXQSJXOTK LZTDFZOG RT LZFUXQPT TLEKIZG, EOTKZQL LZZKQL N EGDWOFQEOGFTL RT LZZKQL GEEKKTF EGF RTZTKDIFQRL YKTETFEIOQL. QRTDQL, IN XFQ ROLLZKOXUEOGF EQKQEZTOKOLZOEQ RT STZKQL JXT TL QHKGBODQRQDTFZT SQ DOLDQ HQKQ EQLO ZGRGL SGL DXTLZKGL RT STFUXQPT.",
    fr: "S'QFQSNTT RT YKTJXTEET TLZ WQLTT LXK ST YQOZ JXT, RQFL FG'DHGKZT JXTST TZTFRXT RT SQFUXT TEKOZT, ETKZQOFTL LZZKQL TZ EGDWOFQOLGFL RT LZZKQL LT HKG RXOL TFZ QCTE RTL YKTJXTEETL CQKOQWSTT. RT H战士L, OS TO LZZ XFT ROLLZKOXXZOGF EIQKQEZTKOLLOJXT RT LZZKQL JXO TLZ Q HHKTB HKTL SQ DTTT HGXK HKTLJXT ZGXL S'TEIQFZOSSGFL RT ETZZT SQFUXT.",
    de: "ROT YKTJXTE MQFQSNLT WQLOTKZ QXY RTK ZQZLQZIT, RQLS OF PTRTD WTSOTXOUTT QWLZIFOZZ ROFLROUHKQEIT, WTLZODDZT WXEIZQX TF XFR AGDWOFQZOGFTF CGT WXEIZQX TF DOZ XFZTKEIORTSOTITF YKTJXTE MTF QXYRKTZTF. RXKRKRTD IOFQXE UXWZ TL TOFT EIQKQAZTKOLLOLEIT CIKZTOX XFU CGT WXEIZQX TF, ROT YXK YQLZ QSSL LZGEIHKGWTF ROTLTK LHKQEIT DQIT ROF RTSTWTS.",
};

function init() {
    setupSubstitutionGrid();
    updateCharts();
    attachEventListeners();
}

function setupSubstitutionGrid() {
    substitutionGrid.innerHTML = '';
    alphabet.forEach(char => {
        const item = document.createElement('div');
        item.className = 'sub-item';

        const inner = document.createElement('div');
        inner.className = 'sub-item-inner';

        const label = document.createElement('label');
        label.textContent = char;

        const arrow = document.createElement('span');
        arrow.className = 'sub-arrow';
        arrow.textContent = '→';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sub-input';
        input.maxLength = 1;
        input.dataset.char = char;
        input.value = substitutions[char];

        input.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase();
            substitutions[char] = val;
            if (val) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
            updateDecodedDisplay();
        });

        inner.appendChild(label);
        inner.appendChild(arrow);
        inner.appendChild(input);
        item.appendChild(inner);
        substitutionGrid.appendChild(item);
    });
}

function updateCharts() {
    const lang = select.value;
    langLabel.textContent = select.options[select.selectedIndex].text;

    // Standard Chart
    renderChart(standardChart, frequencies[lang]);

    // Message Chart
    const textFreq = analyzeFrequency(inputText.value);
    renderChart(messageChart, textFreq);
}

function renderChart(container, data) {
    container.innerHTML = '';
    const maxFreq = Math.max(...Object.values(data), 1);

    let displayOrder = [...alphabet];
    if (sortByFrequency) {
        displayOrder.sort((a, b) => (data[b] || 0) - (data[a] || 0));
    }

    displayOrder.forEach(char => {
        const freq = data[char] || 0;
        const height = (freq / maxFreq) * 100;

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.title = `${char}: ${freq.toFixed(2)}%`;

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${height}%`;

        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = char;

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        container.appendChild(barContainer);
    });
}

function analyzeFrequency(text) {
    const counts = {};
    alphabet.forEach(char => counts[char] = 0);

    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanText.length === 0) return counts;

    for (const char of cleanText) {
        counts[char]++;
    }

    const freqs = {};
    for (const char in counts) {
        freqs[char] = (counts[char] / cleanText.length) * 100;
    }

    return freqs;
}

function updateDecodedDisplay() {
    const text = inputText.value;
    decodedDisplay.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const upperChar = char.toUpperCase();

        if (alphabet.includes(upperChar)) {
            const sub = substitutions[upperChar];
            const span = document.createElement('span');
            span.className = 'decoded-char';

            if (sub) {
                span.textContent = sub;
                span.classList.add('substituted');
            } else {
                span.textContent = char;
            }
            decodedDisplay.appendChild(span);
        } else {
            const node = document.createTextNode(char);
            decodedDisplay.appendChild(node);
        }
    }
}

function attachEventListeners() {
    select.addEventListener('change', () => {
        updateCharts();
    });

    inputText.addEventListener('input', () => {
        updateCharts();
        updateDecodedDisplay();
    });

    resetBtn.addEventListener('click', () => {
        inputText.value = '';
        alphabet.forEach(char => substitutions[char] = '');
        setupSubstitutionGrid();
        updateCharts();
        updateDecodedDisplay();
    });

    sampleBtn.addEventListener('click', () => {
        const lang = select.value;
        inputText.value = samples[lang] || samples['en'];
        updateCharts();
        updateDecodedDisplay();
    });

    copyBtn.addEventListener('click', () => {
        const text = decodedDisplay.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    sortBtn.addEventListener('click', () => {
        sortByFrequency = !sortByFrequency;
        sortBtn.textContent = sortByFrequency ? 'Sort: Frequency' : 'Sort: A-Z';
        updateCharts();
    });
}

init();
