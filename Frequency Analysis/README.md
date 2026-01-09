# Frequency Analysis Simulation

An interactive tool for students to explore the concept of frequency analysis in cryptography. This simulation allows users to analyze letter distributions in multiple languages and apply substitutions to crack simple substitution ciphers.

## Features
- **Multi-language Support**: Standard letter frequencies for English, Spanish, French, and German.
- **Real-time Analysis**: Live frequency calculation for input text.
- **Interactive Substitution**: Map encrypted characters to plaintext and see the results update instantly.
- **Visual Feedback**: Comparison charts between standard and message frequencies.

## Educational Goal
Designed for 9th graders to understand that language has predictable patterns. By comparing the most frequent letters in an encrypted message to the most frequent letters in a target language, students can systematically reverse-engineer monoalphabetic substitution ciphers.

## Tech Stack
- HTML5 / CSS3 (Vanilla)
- JavaScript (ES6+)
- Vite (Build tool)

## Local Development
```bash
npm install
npm run dev
```

## Deployment
Automatically deployed to GitHub Pages via GitHub Actions.

## License
MIT License - &copy; 2026 Vladimir Lopez
