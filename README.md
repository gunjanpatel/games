# Gunjan's Game Room 🎮

A collection of responsive, dark-themed mini-games built with vanilla JavaScript, Tailwind CSS, HTML5 Canvas, and custom CSS3. 

## 🚀 Included Games

### 1. Fortune Wheel (`/fortune`)
A modern, responsive, fully client-side **spinning wheel app**.

#### 🎯 Wheel Features
- **Dynamic Setup:** Setup screen for entering items with quick-select preset choices.
- **Custom Presets:** Create, save, and delete custom configurations preserved via `localStorage`.
- **Visuals & Audio:** Smooth CSS-rendered rotation, automatic wedge color generation, and a realistic "tick" sound effect as the wheel spins.
- **Engaging Gameplay:** Interactive touch dragging to manual-spin the wheel with calculated physics velocity.

#### 🖥 Screenshots
<img width="672" alt="image" src="https://github.com/user-attachments/assets/43c61872-c5b4-4115-be3e-3e6056770772" />
<img width="672" alt="image" src="https://github.com/user-attachments/assets/fbb6d238-a235-49cc-8138-fe225fc3ddfb" />

### 2. Tic-Tac-Toe (`/tictactoe`)
An advanced implementation of the classic game with deep personalization options.

#### 🎯 Tic-Tac-Toe Features
- **Smart AI Mode:** Play against a computer engine using smart move detection that blocks threats and completes winning options with a built-in variance mechanism.
- **Personalized Setup:** Custom name profiles and interactive color swatch selections for game tokens.
- **Audio Feedback:** Integration with the Web Speech API for live, spoken victory and draw announcements.
- **Persistence:** Local scoreboard tracker to save match results over separate browser sessions.

---

## 📁 Project Structure

* `home.css`: Core layout framework, variable schemes, grid structures, and unified glassmorphic animations.
* `/fortune`: Application setup logic (`app.js`), canvas rendering (`wheel.js`), page composition (`index.html`), and unique stylesheets (`styles.css`).
* `/tictactoe`: Game loop definitions (`tictactoe.js`), interface layout (`index.html`), and visual components (`tictactoe.css`).

---

## 🌐 Technical Specifications

* **Stack:** Pure Vanilla JavaScript (ES6+), Tailwind CSS, HTML5 Canvas, Web Speech API, and `localStorage` caching.
* **Design Philosophy:** Premium dark aesthetic utilizing glassmorphism, responsive Flexbox/Grid structures, and direct touch support optimized for both desktop and mobile layouts.
* **Hosting:** 100% static client distribution built to run cleanly on GitHub Pages with a custom domain link.