# ResearchAI

An AI-powered research agent that autonomously researches topics, gathers relevant information from multiple sources, synthesizes findings using AI, and produces structured reports.

![ResearchAI](https://img.shields.io/badge/AI-Powered-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🌟 Features

- **Multi-Source Research**: Searches web, Wikipedia, and news sources simultaneously
- **AI-Powered Synthesis**: Uses OpenRouter (Claude, GPT-4, Llama) for intelligent analysis
- **Structured Reports**: Generates executive summaries, key findings, and detailed sections
- **Real-Time Progress**: Live progress tracking during research
- **Source Citations**: All claims backed by clickable source links
- **Export Functionality**: Download reports as Markdown

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                             RESEARCHAI                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │   FRONTEND   │◄──►│   BACKEND    │◄──►│   AI MODEL LAYER    │   │
│  │   (React)    │    │   (Node.js)  │    │   (OpenRouter)       │   │
│  └──────────────┘    └──────────────┘    └──────────────────────┘   │
│         │                   │                        │               │
│         │                   ▼                        │               │
│         │          ┌──────────────┐                  │               │
│         │          │ DATA LAYER   │                  │               │
│         │          │ - Source     │                  │               │
│         │          │   Aggregator │                  │               │
│         │          │ - Cache      │◄─────────────────┘               │
│         │          └──────────────┘                                  │
│         │                   │                                       │
│         │                   ▼                                       │
│         │          ┌──────────────┐                                 │
│         │          │ EXTERNAL      │                                 │
│         │          │ APIs          │                                 │
│         │          │ - DuckDuckGo  │                                 │
│         │          │ - Wikipedia   │                                 │
│         │          │ - News APIs   │                                 │
│         │          └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd intelligent-research-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

4. **Start development servers**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Required |
| `AI_MODEL` | AI model to use | `anthropic/claude-sonnet-4` |
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

### Supported AI Models

- `anthropic/claude-sonnet-4` (Recommended)
- `anthropic/claude-3.5-sonnet`
- `openai/gpt-4o`
- `openai/gpt-4o-mini`
- `meta-llama/llama-3.1-70b-instruct`

## 📁 Project Structure

```
intelligent-research-assistant/
├── client/                          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueryInput.tsx       # Research query form
│   │   │   ├── ProgressIndicator.tsx # Real-time progress
│   │   │   └── ReportView.tsx       # Generated report display
│   │   ├── api/
│   │   │   └── client.ts            # Backend API client
│   │   ├── App.tsx                  # Main application
│   │   └── main.tsx                 # Entry point
│   └── package.json
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   │   └── research.ts          # Research API endpoints
│   │   ├── services/
│   │   │   ├── searchService.ts      # Multi-source search
│   │   │   ├── contentService.ts     # Content extraction
│   │   │   ├── aiService.ts          # OpenRouter integration
│   │   │   └── reportService.ts      # Report generation
│   │   └── index.ts                  # Server entry point
│   └── package.json
├── shared/                           # Shared types
│   ├── src/
│   │   └── index.ts                  # Shared type definitions
│   └── package.json
├── package.json                      # Root package.json
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

## 🔌 API Endpoints

### `POST /api/research`
Start a new research query.

**Request Body:**
```json
{
  "query": "What are the latest developments in quantum computing?",
  "sources": ["web", "wikipedia"],
  "maxResults": 10
}
```

**Response:**
```json
{
  "researchId": "uuid-here"
}
```

### `GET /api/research/:id/progress`
Get current research progress.

**Response:**
```json
{
  "stage": "synthesizing",
  "message": "Synthesizing findings with AI...",
  "progress": 60,
  "sources": [...]
}
```

### `GET /api/research/:id/report`
Get the completed research report.

## 🧪 Development

### Run in development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Run type checking
```bash
npm run typecheck
```

## 🛠️ Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript + TailwindCSS | Modern UI |
| **Backend** | Node.js + Express | API server |
| **AI** | OpenRouter API | Claude/GPT-4/Llama |
| **Search** | DuckDuckGo + Wikipedia API | Information retrieval |
| **Build** | Vite | Fast development |

## 📝 Key Features Explained

### Multi-Source Research
The system searches multiple sources in parallel:
- **Web Search**: DuckDuckGo for general web results
- **Wikipedia**: Encyclopedia content for factual information
- **News**: Current events and recent developments

### AI-Powered Synthesis
Using OpenRouter, the system:
1. Analyzes query intent
2. Summarizes content from each source
3. Identifies key themes and findings
4. Generates coherent narrative with citations

### Structured Output
Reports include:
- Executive summary
- Key findings with evidence
- Detailed analysis sections
- Source citations with links

## 📄 License

MIT License - feel free to use for your own projects!

## 🙏 Acknowledgments

- OpenRouter for unified AI model access
- DuckDuckGo for privacy-friendly search
- Wikipedia for open knowledge

---

Built for the Inteledge Advisory & Labs Internship Evaluation