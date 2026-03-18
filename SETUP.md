# ResearchAI - Setup Guide

## ✅ Project Status

Your ResearchAI platform is now **fully set up and running**!

## 🚀 Current Status

- ✅ **Backend Server**: Running on http://localhost:3000
- ✅ **Frontend Client**: Running on http://localhost:5173
- ✅ TypeScript compilation: All errors fixed
- ✅ Dependencies: Installed
- ⚠️ **OpenRouter API Key**: Not configured (using fallback mode)

## 🌐 Access Your Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🔑 Configure OpenRouter API Key (Required for AI Features)

To enable full AI-powered research synthesis:

1. Get your API key from: https://openrouter.ai/keys
2. Open the `.env` file in the project root
3. Replace `your_openrouter_api_key_here` with your actual API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
   ```
4. Restart the server (the process will auto-reload)

## 📦 Project Structure

```
intelligent-research-assistant/
├── client/          # React frontend (Vite + TypeScript + Tailwind)
├── server/          # Express backend (Node.js + TypeScript)
├── shared/          # Shared TypeScript types
├── .env             # Environment configuration
└── README.md        # Full documentation
```

## 🛠️ Available Commands

### Development
```bash
# Run both client and server
npm run dev

# Run only server
npm run dev:server

# Run only client
npm run dev:client
```

### Build
```bash
# Build all packages
npm run build

# Build specific workspace
npm run build --workspace=client
npm run build --workspace=server
npm run build --workspace=shared
```

### Type Checking
```bash
# Check all workspaces
npm run typecheck

# Check specific workspace
npm run typecheck --workspace=client
npm run typecheck --workspace=server
```

## 🎯 How to Use

1. **Open the app** at http://localhost:5173
2. **Enter a research query** (e.g., "Impact of AI on healthcare")
3. **Select sources** (Web, Wikipedia, News)
4. **Click "Start Research"**
5. **Watch the progress** as the system:
   - Analyzes your query
   - Searches multiple sources
   - Extracts content
   - Synthesizes findings with AI
   - Generates a structured report
6. **View your report** with:
   - Executive summary
   - Key findings with evidence
   - Detailed sections
   - Source citations

## 🔧 Configuration Options

### Environment Variables (.env)

```bash
# Required for AI synthesis
OPENROUTER_API_KEY=your_key_here

# Server port (default: 3000)
PORT=3000

# Environment
NODE_ENV=development

# AI Model (optional, defaults to claude-sonnet-4)
AI_MODEL=anthropic/claude-sonnet-4
```

### Supported AI Models

- `anthropic/claude-sonnet-4` (default, best quality)
- `anthropic/claude-3.5-sonnet`
- `openai/gpt-4o`
- `openai/gpt-4o-mini` (faster, cheaper)
- `meta-llama/llama-3.1-70b-instruct`

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:
1. Change PORT in `.env` file
2. Update the proxy target in `client/vite.config.ts`

### API Key Issues
- Verify your OpenRouter API key is valid
- Check you have credits in your OpenRouter account
- The app will work in fallback mode without AI synthesis

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules
rm -rf */node_modules
npm install
npm run build --workspace=shared
```

## 📚 Next Steps

1. **Configure your OpenRouter API key** for full AI features
2. **Try different research queries** to test the system
3. **Customize the AI model** in `.env` for different results
4. **Review the code** in `server/src/services/` to understand the workflow
5. **Modify the UI** in `client/src/components/` to match your preferences

## 🎉 Features

- ✅ Multi-source research (Web, Wikipedia, News)
- ✅ Real-time progress tracking
- ✅ AI-powered synthesis with OpenRouter
- ✅ Structured report generation
- ✅ Source citations with links
- ✅ Modern, responsive UI
- ✅ TypeScript throughout
- ✅ Monorepo architecture

## 📖 Documentation

For more details, see:
- `README.md` - Full project documentation
- `server/src/` - Backend implementation
- `client/src/` - Frontend implementation
- `shared/src/` - Shared types

---

**Status**: ✅ Ready to use!
**Last Updated**: March 17, 2026
