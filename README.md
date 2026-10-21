# ✨ Cinematic Birthday Memories & 3D Interactive Scrapbook

An immersive, cinematic birthday celebration and interactive memory scrapbook experience built with **React 19**, **Three.js**, custom **WebGL shaders**, **Framer Motion**, and **Tailwind CSS**.

---

## 🌟 Key Highlights & Acts

### 🎭 Act 1: The Birthday Grand Finale
- Handcrafted plaque with gold foil calligraphy and warm cinematic lighting.
- Ambient navy watercolor backdrop with dynamically floating gold dust and flower petals.
- Grand celebratory confetti explosion triggered with physics-based particle vectors.

### 🎞️ Act 2 & 3: Living Universe & Ribbon Carousel
- Seamless zero-seam sticky video backdrop that glides with smooth inertia across memories.
- Ribbon Carousel displaying curated photographic portraits with full-screen zoom modals.
- Scattered memory polaroids with hover depth, parallax, and gentle tactile tilts.

### 📖 Act 4: Interactive Memory Sketchbook
- Tactile flipbook sketchbook experience with realistic parchment grain and page transitions.
- Hand-drawn decorative flora animations, handwritten love notes, and Polaroid photo mounts.

### 🌌 Act 5: 3D Cosmos & Wobble Fence Epilogue
- Interactive 3D Three.js WebGL particle sphere gallery: drag, spin, and orbit freely through memorable moments.
- Kinetic wobble fence physics simulation rendered with custom fragment and vertex shaders.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **3D Graphics & Shaders**: [Three.js](https://threejs.org/) & Raw WebGL2
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/ansaftab-1/Customer-Segmentation-and-Churn-Prediction-Model.git

# Enter the project directory
cd Customer-Segmentation-and-Churn-Prediction-Model

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to experience the application.

### Building for Production

```bash
# Lint source code
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── public/                 # Static video backgrounds, textures, and vector assets
├── src/
│   ├── assets/             # Branding and SVG assets
│   ├── components/
│   │   ├── BirthdayFinale.jsx           # Act 1: Grand opening & watercolor celebration
│   │   ├── ForeverPage.jsx              # Act 5: Epilogue container
│   │   ├── ImageModal.jsx               # High-res photo lightbox modal
│   │   ├── RibbonCarousel.jsx           # Act 2: Continuous memory ribbon
│   │   ├── ScatteredGallery.jsx         # Act 3: Polaroid memory wall
│   │   ├── Sketchbook.jsx               # Act 4: Interactive flipbook sketchbook
│   │   ├── SphereGallery3D.jsx          # Interactive WebGL 3D photo sphere
│   │   ├── WatercolorGoldBackground.jsx # Animated canvas watercolor background
│   │   ├── WaveRibbons.jsx              # WebGL fluid ribbon effects
│   │   └── WobbleFence.jsx              # Three.js kinetic wobble fence simulation
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Custom styles, grain filters & typography
│   ├── main.jsx            # React root entry point
│   └── photosData.js       # Gallery photography catalog
├── package.json
└── vite.config.js
```

---

## 📄 License

Created with ❤️ for a very special celebration.
