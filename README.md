# CodeVerter 🔄

A modern web application that converts code between 25+ programming languages using Google's Generative AI.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-teal)

## Features

- 🌐 Convert code between 25+ programming languages
- ⚡ Lightning-fast conversion powered by Google Gemini AI
- 🎨 Clean and intuitive user interface with Tailwind CSS
- 💻 Full-stack application with React frontend and Express backend
- 📱 Responsive design for all devices
- 🔒 Secure API communication with CORS protection

## Supported Languages

Python, JavaScript, TypeScript, Java, C++, C#, C, Go, Rust, Swift, Kotlin, PHP, Ruby, Scala, R, MATLAB, Perl, Haskell, Lua, Dart, Elixir, F#, Clojure, Objective-C, Visual Basic, and more!

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Google Generative AI** - AI-powered code conversion
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://ai.google.dev))

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd codeverter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then add your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

Optional hardening variables:

```env
# Frontend API endpoint override (leave unset to use /api in dev)
VITE_API_URL=http://localhost:3001

# Comma-separated allowlist for CORS. Leave empty to allow all origins.
ALLOWED_ORIGINS=http://localhost:5173

# API protection and reliability settings
MAX_BODY_SIZE=1mb
REQUEST_TIMEOUT_MS=30000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
```

## Usage

### Development

Run both frontend and backend concurrently:

```bash
npm run dev:full
```

Or run them separately:

```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend dev server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## API Endpoints

### POST `/api/convert`

Convert code from one language to another.

**Request:**
```json
{
  "sourceCode": "def hello():\n    print('Hello, World!')",
  "sourceLanguage": "Python",
  "targetLanguage": "JavaScript"
}
```

**Response:**
```json
{
  "convertedCode": "function hello() {\n    console.log('Hello, World!');\n}",
  "success": true
}
```

## Project Structure

```
codeverter/
├── src/
│   ├── components/
│   │   └── CodeVerter/
│   │       ├── CodeVerter.jsx
│   │       ├── LanguageDropdown.jsx
│   │       ├── constants.js
│   │       └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── server.js
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── index.html
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, issues, or feature requests, please open an issue in your repository's issue tracker.

## Acknowledgments

- Google Gemini AI for powerful code conversion capabilities
- [Vite](https://vitejs.dev/) for blazing fast builds
- [Tailwind CSS](https://tailwindcss.com/) for amazing utility-first CSS
- [React](https://react.dev/) for the excellent UI library
