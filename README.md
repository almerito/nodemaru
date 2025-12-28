# Nodemaru Visual Composer

<p align="center">
  <img src="images/logo-white.png" alt="Nodemaru Visual Composer" width="300">
</p>

<p align="center">
  <strong>A visual node-based editor for Hydra Video Synth</strong>
</p>

<p align="center">
  <a href="https://nodemaru.com">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#getting-started">🚀 Getting Started</a> •
  <a href="#documentation">📚 Documentation</a>
</p>

---

## Overview

**Nodemaru Visual Composer** is a visual patcher for [Hydra Live Coding](https://hydra.ojack.xyz/). It allows you to create complex, reactive visual synthesizers using an intuitive node-based interface — no coding required!

Create animated visuals that react to **Audio**, **Video**, **Webcam**, **Screen capture**, **MIDI**, **LFO** and more, all connected through a visual patching system.

🔗 **Try it now at [https://nodemaru.com](https://nodemaru.com)**

---

## Features

### 🎨 Visual Patching
- **Intuitive Node-Based Interface** — Drag and drop nodes onto an infinite canvas
- **Visual Connections** — Connect nodes with cables to build complex visual chains
- **Real-time Preview** — See your creations live as you build them
- **Full-screen Mode** — Run your visuals in full-screen

### 🎵 Audio Reactive
- **Audio Analysis** — Powered by [Meyda](https://meyda.js.org/) for advanced audio feature extraction
- **Multiple Audio Sources** — Use microphone, audio interface, or local audio files
- **Rich Audio Features** — RMS, Spectral Centroid, Loudness, Rhythm, Transients, Frequency Bands, and more
- **Adaptive Range** — Automatically adjusts to your audio's dynamic range

### 🎹 MIDI Integration
- **MIDI Input** — Control parameters in real-time with any MIDI controller
- **Note, Velocity, CC, Aftertouch** — Full MIDI message support
- **Scene Triggers** — Switch between scenes using MIDI notes or CC values
- **Channel Selection** — Filter by MIDI channel (1-16) or receive all

### 🎬 Multi-Scene Performances
- **Scene Management** — Create multiple scenes with unique visual patches
- **Scene Transitions** — Add transitions including Crossfade, Fade to Black, Wipe, Radial, Glitch, Zoom, Pixelate, and Melt
- **Configurable Timing** — Set scene duration in seconds, minutes, beats, or trigger via MIDI
- **Scene Ordering** — Drag and drop to reorder scenes

### 📹 Video Recording
- **High-Quality Recording** — Record your visuals up to 60 FPS
- **Multiple Formats** — WebM (VP9/VP8) and MP4 (H.264/H.265)
- **Audio Recording** — Include audio from any input device
- **Quality Control** — Adjustable bitrate from 2 Mbps to lossless

### 📦 External Sources
- **Local Files** — Load images and videos from your computer
- **Remote Images** — Load images from URLs
- **Webcam Input** — Use any connected camera as a source
- **Screen Capture** — Capture your screen or specific windows

### 💾 Preset Management
- **Cloud Save** — Save your patches to the cloud (requires account, images and video excluded)
- **Local Export/Import** — Export patches as JSON files for backup
- **Preset Library** — Browse and load presets
- **User Accounts** — Register with email or Google authentication

### 🎛️ Data Nodes
- **LFO** — Low Frequency Oscillators with multiple waveforms (Sine, Square, Sawtooth, Triangle, Pulse)
- **Arrays** — Create value sequences with BPM sync, smoothing, and easing
- **MIDI Nodes** — Map MIDI input to parameter values
- **Audio Nodes** — Extract audio features for visual modulation

---

## Node Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Sources** | Generate base textures | `osc`, `shape`, `noise`, `voronoi`, `gradient`, `solid` |
| **External Source** | Load external media | Local Image/Video, Remote Image, Webcam, Screen |
| **Geometry** | Transform coordinates | `rotate`, `scale`, `kaleid`, `pixelate`, `repeat`, `scroll` |
| **Color** | Modify pixel colors | `posterize`, `invert`, `contrast`, `brightness`, `saturate`, `hue`, `colorama` |
| **Blend** | Combine two textures | `blend`, `add`, `diff`, `mask`, `mult` |
| **Modulate** | Deform using luminosity | `modulate`, `modulateRotate`, `modulateScale`, `modulateKaleid` |
| **Output** | Render to output buffers | `o0`, `o1`, `o2`, `o3`, `render` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/almerito/nodemaru.git
   cd nodemaru
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (database, authentication, etc.)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

---

## Controls

### Canvas Navigation
| Action | Control |
|--------|---------|
| Pan | Middle Mouse Button or Space + Left Drag |
| Zoom | Mouse Scroll |
| Add Node | Double-click on canvas or click "Add Node (+)" |

### Node Operations
| Action | Control |
|--------|---------|
| Select Node | Click |
| Multi-select | Shift + Click |
| Box Selection | Right Mouse Button + Drag |
| Delete | Select node(s) and press Delete or Backspace |
| Connect | Drag from output socket to input socket |

### Connector Types
- **Orange (Output)** — Node chain output
- **Green (Input)** — Node chain input  
- **Blue** — Parameter connectors for data nodes

---

## Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES Modules)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Visual Engine**: [Hydra Synth](https://github.com/hydra-synth/hydra-synth)
- **Audio Analysis**: [Meyda](https://meyda.js.org/)
- **Video Processing**: WebGL, Canvas API
- **Backend**: PHP API with SQLite

---

## Project Structure

```
nodemaru/
├── api/                 # PHP API endpoints
├── dist/                # Production build output
├── docs/                # Documentation
├── images/              # Static images
├── shaders/             # Custom WebGL shaders
├── src/
│   ├── core/            # Core application modules
│   │   ├── Editor.js           # Main editor controller
│   │   ├── HydraCompiler.js    # Hydra code generator
│   │   ├── Node.js             # Node data model
│   │   ├── Connection.js       # Connection handling
│   │   ├── SceneManager.js     # Scene/transition management
│   │   ├── RecordingManager.js # Video recording
│   │   ├── WebGLCompositor.js  # Scene compositing
│   │   ├── PersistenceManager.js # Save/Load functionality
│   │   ├── AuthManager.js      # User authentication
│   │   └── NodeUIRenderers.js  # Node UI components
│   ├── ui/              # UI components
│   └── main.js          # Application entry point
├── index.html           # Main application page
├── help.html            # Documentation page
├── credits.html         # Credits page
├── style.css            # Main stylesheet
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies & scripts
```

---

## Documentation

For detailed documentation on how to use Nodemaru, including:
- Node types and their parameters
- Audio analysis features reference
- Scene transitions guide
- MIDI mapping setup
- Troubleshooting

Visit the [Help Page](https://nodemaru.com/help.html) or view `help.html` locally.

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See the [LICENSE](LICENSE) file for details.

---

## Credits

- **[Hydra Synth](https://hydra.ojack.xyz/)** — The amazing live coding video synth created by Olivia Jack
- **[Meyda](https://meyda.js.org/)** — Audio feature extraction library
- **[Vite](https://vitejs.dev/)** — Next generation frontend tooling

---

## Links

- 🌐 **Website**: [https://nodemaru.com](https://nodemaru.com)
- 📖 **Documentation**: [https://nodemaru.com/help.html](https://nodemaru.com/help.html)
- 🙏 **Credits**: [https://nodemaru.com/credits.html](https://nodemaru.com/credits.html)

---

<p align="center">
  Made with ❤️ for the live visuals community
</p>
