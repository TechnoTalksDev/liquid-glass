# Liquid Glass

A recreation of the iOS "liquid glass" media player effect, built with SvelteKit and powered by live Spotify data. This project was inspired by the iOS 26 "liquid glass" update and [this video](https://www.youtube.com/watch?v=Cv8zFvM8fEk), pushing the boundaries of what's possible with web-based glass morphism effects.

## ✨ Features

- **Live Spotify Integration**: Real-time music data pulled every ~5 seconds
- **Liquid Glass UI**: Recreates the iOS media player interface with glass morphism effects
- **Dynamic Progress Bar**: Shows actual playback progress from your Spotify account
- **Chrome-Based Browser Required**: Optimized for Chrome-based browsers for the best glass effects
- **Background Video**: Features a looping background video that complements the glass aesthetic

## 🏗️ Tech Stack

### Frontend

- **SvelteKit**: Modern web framework for the UI
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Glass Morphism Effects**: Custom CSS and SVG effects for the liquid glass appearance

### Backend Architecture

- **n8n Workflow**: Handles Spotify API integration and data processing
- **Redis Cache**: Prevents hitting Spotify's rate limits when handling multiple users
- **Spotify Web API**: Sources live music data including track info, progress, and album art

The backend uses an n8n workflow to efficiently manage Spotify API calls and cache responses in Redis, ensuring smooth real-time updates without exceeding API limits.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Chrome-based browser (Chrome, Edge, Opera, Brave, Vivaldi)
- Spotify Premium account (for live data integration)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TechnoTalksDev/liquid-glass.git
cd liquid-glass
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

## 🛠️ Development

Once you've installed dependencies, start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## 📦 Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 🎵 How It Works

The application displays a beautiful glass morphism interface that mirrors your currently playing Spotify track. Here's what makes it special:

- **Real-time Updates**: Music data refreshes every 2.5 seconds to show live progress
- **Dynamic Colors**: Album art dominant colors create a glowing effect around the cover
- **Responsive Design**: Optimized for various screen sizes while maintaining the glass aesthetic
- **Browser Compatibility**: Best experienced on Chrome-based browsers due to advanced CSS effects

### Backend Integration

The n8n workflow backend handles:

- Spotify OAuth authentication
- API rate limit management through Redis caching
- Real-time data synchronization
- Multiple user session handling

Note: Playback controls (play/pause, skip, volume) are displayed for UI completeness but are non-functional to prevent unauthorized control of user's music.

## 🎥 Background Video

The default background features [this ambient video](https://www.youtube.com/watch?v=hOgVAYpHPCc) that complements the liquid glass aesthetic. You can toggle between video and static wallpaper modes.

## ⚠️ Browser Requirements

This project requires a Chrome-based browser for optimal performance. The glass morphism effects may not render correctly in Firefox, Safari, or other non-Chromium browsers.

## 🤝 Contributing

This project was built in a day as an experimental recreation of iOS liquid glass effects. If you encounter any quirks or have suggestions for improvements, feel free to open an issue or submit a pull request!

## 🙏 Acknowledgments

- Inspired by the iOS 26 "liquid glass" update
- Special thanks to [this video tutorial](https://www.youtube.com/watch?v=Cv8zFvM8fEk) that sparked the initial idea
- Built with ❤️ using SvelteKit and modern web technologies
