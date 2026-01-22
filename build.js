const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SIMULATIONS = [
    { name: 'Caesar Wheel', offset: 'caesar' },
    { name: 'Frequency Analysis', offset: 'frequency' },
    { name: 'quantum-cryptography', offset: 'quantum' },
    { name: 'Scytale', offset: 'scytale' },
    { name: 'Vigenere Cipher', offset: 'vigenere' }
];

const DIST_DIR = path.join(__dirname, 'dist');
const LANDING_PAGE_DIR = path.join(__dirname, 'landing-page');

// Helper to run commands
function run(command, cwd) {
    console.log(`Running: ${command} in ${cwd || '.'}`);
    execSync(command, { stdio: 'inherit', cwd: cwd || __dirname });
}

// 1. Clean and Setup Dist
console.log('--- Cleaning dist directory ---');
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);
fs.mkdirSync(path.join(DIST_DIR, 'sims'));

// 2. Build and Copy Simulations
console.log('--- Building Simulations ---');
SIMULATIONS.forEach(sim => {
    const simDir = path.join(__dirname, sim.name);
    const destDir = path.join(DIST_DIR, 'sims', sim.offset);

    console.log(`Building ${sim.name}...`);

    // Install dependencies if needed (checking node_modules is a basic check)
    if (!fs.existsSync(path.join(simDir, 'node_modules'))) {
        run('npm install', simDir);
    }

    // Build
    run('npm run build', simDir);

    // Copy build to dist
    const simDist = path.join(simDir, 'dist');
    if (fs.existsSync(simDist)) {
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        run(`cp -R "${simDist}/." "${destDir}"`);
    } else {
        console.error(`Error: Build directory not found for ${sim.name}`);
    }
});

// 3. Copy Landing Page Assets
console.log('--- Copying Landing Page ---');
run(`cp -R "${LANDING_PAGE_DIR}/." "${DIST_DIR}"`);

// 4. Ensure simulations can access assets via relative path "../landing-page/assets"
// Simulations in dist/sims/X look for ../landing-page/assets.
// That resolves to dist/sims/landing-page/assets.
const sharedAssetsDir = path.join(DIST_DIR, 'sims', 'landing-page');
if (!fs.existsSync(sharedAssetsDir)) {
    fs.mkdirSync(sharedAssetsDir, { recursive: true });
}
run(`cp -R "${LANDING_PAGE_DIR}/assets" "${sharedAssetsDir}/"`);

console.log('--- Build Complete! ---');
console.log(`Website assembled in ${DIST_DIR}`);
