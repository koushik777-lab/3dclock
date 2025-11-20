# 3D Clock App ⏰

A modern, feature-rich clock application with stunning 3D visualizations, built with React, Three.js, and GSAP animations. Fully responsive and optimized for both desktop and mobile devices.

![3D Clock App](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.181.2-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### 🕐 Clock
- **3D Interactive Clock** - Draggable 3D clock model with realistic animations
- **Real-time Display** - Live time updates with smooth transitions
- **Neon Aesthetics** - Cyberpunk-inspired glowing effects

### 🌍 World Clock
- **Multiple Timezones** - Track time across different cities worldwide
- **Add Custom Cities** - Support for any timezone (IANA format)
- **3D Globe Background** - Animated rotating Earth visualization
- **Responsive Grid** - Adaptive layout for any screen size

### ⏱️ Stopwatch
- **High Precision** - Millisecond-accurate timing
- **Lap Recording** - Track multiple lap times with animations
- **3D Visualization** - Interactive 3D stopwatch model
- **GSAP Animations** - Smooth entry and interaction effects

### ⏲️ Timer
- **Countdown Timer** - Set hours, minutes, and seconds
- **Visual Progress** - 3D timer visualization with progress indication
- **Audio Alerts** - Sound notification when timer completes
- **Pause/Resume** - Full control over timer state

### ⏰ Alarm
- **Multiple Alarms** - Set unlimited alarms with custom labels
- **12/24 Hour Format** - Automatic time format conversion
- **Persistent Storage** - Alarms saved in localStorage
- **Edit & Toggle** - Easily manage your alarms
- **Browser Notifications** - Desktop notifications when alarms trigger
- **Audio Alerts** - Gradual volume increase for gentle wake-up

## 🎨 Design Features

- **Glassmorphism UI** - Modern glass-effect panels with backdrop blur
- **Neon Color Scheme** - Vibrant green and yellow neon accents
- **Dark Theme** - Eye-friendly dark background
- **Smooth Animations** - Framer Motion and GSAP powered transitions
- **3D Interactions** - Draggable and interactive 3D models
- **Responsive Design** - Optimized for desktop, tablet, and mobile

## 📱 Mobile Responsive

Fully optimized for mobile devices with:
- Touch-friendly controls (44px minimum touch targets)
- Adaptive layouts using CSS Grid and Flexbox
- Fluid typography with `clamp()`
- Responsive 3D canvas sizing
- Tested on iPhone SE (375px) and larger screens

## 🚀 Tech Stack

### Core
- **React 19.2.0** - UI framework
- **Vite 7.2.2** - Build tool and dev server
- **Three.js 0.181.2** - 3D graphics

### 3D & Animation
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **@react-spring/three** - Spring physics animations for 3D
- **@use-gesture/react** - Gesture handling for drag interactions
- **GSAP 3.13.0** - Professional-grade animation library
- **Framer Motion 12.23.24** - React animation library

### Utilities
- **date-fns** - Modern date utility library
- **date-fns-tz** - Timezone support
- **lucide-react** - Beautiful icon library

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/koushik777-lab/3dclock.git

# Navigate to project directory
cd 3dclock

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🌐 Deployment

This app is configured for deployment on Netlify with automatic builds.

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Your app will be deployed automatically on every push to main

The `netlify.toml` configuration ensures:
- Proper npm installation of dependencies
- Correct build command execution
- Rollup native package compatibility

## 📁 Project Structure

```
3dclock/
├── src/
│   ├── components/
│   │   └── AdvancedClock/
│   │       ├── MainInterface.jsx    # Main app container
│   │       ├── Clock3D.jsx          # 3D clock component
│   │       ├── WorldClock.jsx       # World clock feature
│   │       ├── WorldBackground3D.jsx # 3D globe background
│   │       ├── Stopwatch.jsx        # Stopwatch feature
│   │       ├── Stopwatch3D.jsx      # 3D stopwatch model
│   │       ├── Timer.jsx            # Timer feature
│   │       ├── Timer3D.jsx          # 3D timer model
│   │       ├── Alarm.jsx            # Alarm feature
│   │       ├── Alarm3D.jsx          # 3D alarm model
│   │       ├── ErrorBoundary.jsx    # Error handling
│   │       └── styles.css           # Component styles
│   ├── App.jsx                      # Root component
│   ├── App.css                      # App styles
│   ├── index.css                    # Global styles
│   └── main.jsx                     # Entry point
├── public/                          # Static assets
├── netlify.toml                     # Netlify configuration
├── package.json                     # Dependencies
└── vite.config.js                   # Vite configuration
```

## 🎯 Key Features Explained

### 3D Interactions
All 3D models are interactive and can be rotated using mouse drag or touch gestures. The models are built with Three.js and integrated seamlessly with React using react-three-fiber.

### Alarm System
- Alarms are checked every second against the current time
- When triggered, alarms play a sound with gradually increasing volume
- Browser notifications are shown if the tab is not active
- Alarms can be edited, toggled, or deleted
- All alarm data persists in localStorage

### Responsive Design
The app uses modern CSS techniques:
- `clamp()` for fluid typography
- CSS Grid with `minmax()` for responsive layouts
- Flexbox with `flex-wrap` for adaptive controls
- Media queries for tablet (768px) and mobile (480px)

## 🔧 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Koushik Sarkar**
- GitHub: [@koushik777-lab](https://github.com/koushik777-lab)

## 🙏 Acknowledgments

- Three.js community for amazing 3D capabilities
- React Three Fiber for seamless React integration
- GSAP for professional animations
- Framer Motion for smooth UI transitions

---

Made with ❤️ using React, Three.js, and modern web technologies
