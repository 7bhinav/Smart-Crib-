# Smart Crib Monitor - Baby Health Tracking System

A React-based web application for real-time monitoring of baby vital signs with AI-powered pediatric clinical assistant.

## Features

- 🏥 Real-time vital signs monitoring (Heart Rate, O2 Saturation, Temperature)
- 🤖 AI-powered ChatBot with GROQ API for pediatric guidance
- 📊 Real-time analytics and trend analysis
- 🚨 Alert system for abnormal readings
- 📱 Responsive design with Tailwind CSS
- 🔐 Secure authentication system

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Custom + Radix UI
- **Charts**: Recharts, D3
- **Backend API**: GROQ API (via serverless functions)
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- GROQ API key from [console.groq.com](https://console.groq.com)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd untitled\ folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Add your GROQ API key to `.env`**
   ```
   GROQ_API_KEY=your_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Smart Crib Monitor"

# Add remote repository
git remote add origin https://github.com/yourusername/repository-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Click on "Environment Variables"
   - Add `GROQ_API_KEY` with your API key value
   - Click "Save"

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 3: Access Your App

- Your app will be available at `https://your-project.vercel.app`
- The AI chat API will work automatically via the `/api/chat` serverless function

## API Routes

### Chat API

**Endpoint**: `/api/chat`

**Method**: `POST`

**Request**:
```json
{
  "message": "What should I do if my baby has a fever?"
}
```

**Response**:
```json
{
  "reply": "For fever in babies, you should..."
}
```

## Environment Variables

Required for deployment:
- `GROQ_API_KEY`: Your GROQ API key for AI responses

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── utils/           # Utility functions
│   └── styles/          # CSS files
├── api/
│   └── chat.js          # Serverless chat function (Vercel)
├── public/              # Static assets
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build locally

## Deployment Notes

- The app uses Vercel serverless functions for the chat API
- No Node.js server needed for Vercel - everything runs as serverless functions
- Environment variables are securely managed by Vercel
- The frontend (React/Vite) builds to static files and is served globally

## Troubleshooting

### API not working after deployment
- Verify `GROQ_API_KEY` is set in Vercel environment variables
- Check the Vercel function logs in the dashboard
- Ensure the API endpoint is correctly set to `/api/chat`

### Build failures
- Check that all dependencies are installed: `npm install`
- Ensure Node.js version 18+ is used
- Check build logs in Vercel dashboard

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
