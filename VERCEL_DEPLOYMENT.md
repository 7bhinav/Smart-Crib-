# Vercel Deployment Guide for Smart Crib Monitor

## ✅ Step 1: Code is Ready on GitHub!

Your code has been pushed to: `https://github.com/7bhinav/Smart-Crib-`

## 🚀 Step 2: Deploy to Vercel (Follow These Steps)

### 2.1 Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account (or create one if you don't have)

### 2.2 Import Your Project
1. Click **"New Project"** or **"Import Project"**
2. Select **GitHub** as the source
3. Search for **"Smart-Crib-"** repository
4. Click **"Import"**

### 2.3 Configure Environment Variables
1. You'll see a screen asking for environment variables
2. Add the following:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Paste your GROQ API key from your `.env` file
3. Click **"Add"**

### 2.4 Deploy
1. Click **"Deploy"** button
2. Wait for the deployment to complete (usually 1-2 minutes)
3. Once done, you'll get a URL like: `https://your-project.vercel.app`

## 🎯 Step 3: Test Your Deployment

1. Open your Vercel URL in browser
2. Navigate to the ChatBot
3. Try asking: "Hello, how are you?"
4. The AI should respond using GROQ API

## 🔑 Important Notes

- **GROQ_API_KEY**: This is already in your environment, but Vercel needs it set explicitly
- **No Server Needed**: Vercel automatically handles the `/api/chat` serverless function
- **Auto-Deployment**: Every time you push to GitHub, Vercel will automatically rebuild and deploy

## 📊 Monitoring & Logs

In Vercel Dashboard:
1. Go to your project
2. Click **"Deployments"** to see deployment history
3. Click **"Functions"** to see API function logs
4. Use **"Logs"** tab to debug any issues

## 🆘 Troubleshooting

### "API Key not configured" error
- Go to Vercel project settings
- Check "Environment Variables" 
- Ensure `GROQ_API_KEY` is set correctly

### Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are installed locally: `npm install`
- Try pushing again if it's a transient issue

### Chat API returns 500 error
- Check Vercel function logs
- Verify GROQ API key is valid
- Try making a test request with curl:
  ```
  curl -X POST https://your-project.vercel.app/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "hello"}'
  ```

## 📝 Project URLs

- **GitHub Repo**: https://github.com/7bhinav/Smart-Crib-
- **Live App**: https://your-project.vercel.app (after deployment)
- **API Endpoint**: https://your-project.vercel.app/api/chat

---

**Ready to deploy?** 🚀 Head over to [vercel.com](https://vercel.com) and follow Step 2.3 above!
