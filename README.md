# 🇪🇹 Ethio Student Material - Telegram Bot & Web Platform

A modern, full-stack Next.js application & Telegram Bot tailored for Ethiopian students. When a student starts the bot (`/start`), it prompts them to share their phone number with a single tap, stores their verified profile into **Firebase Firestore (Free Spark Plan)**, and unlocks Grade 9–12 textbooks, past national matric exams, and teacher guides.

---

## 🌟 Features

- **📱 One-Tap Contact Verification**: Requests phone number using Telegram's native `request_contact: true` reply keyboard.
- **🔥 Firebase Firestore (Spark Free Plan)**:
  - **50,000 Free Reads / day**
  - **20,000 Free Writes / day**
  - **1 GB Free Document Storage**
  - **$0 / Month Forever** with no credit card required.
- **🏗️ Modern Modular Architecture**: Clean separation between handlers, keyboards, database services, and Next.js routes.
- **📚 Ethiopian Curriculum Support**: Grade 9, Grade 10, Grade 11 (Natural/Social), Grade 12 (Natural/Social), and University levels.
- **⚡ Dual Mode Operation**:
  - **Development Mode**: `npm run bot:dev` (Long polling - test locally without needing ngrok/webhooks!)
  - **Production Mode**: Next.js App Router Webhook (`/api/bot`).
- **💻 Interactive Web Dashboard**: Built with Next.js & Tailwind CSS featuring a live student registry and interactive bot simulator.

---

## 📁 Project Structure

```
ethio-student-material/
├── app/
│   ├── api/
│   │   ├── bot/route.ts          # Next.js Webhook endpoint for Telegram updates
│   │   └── users/route.ts        # REST API for registered students & stats
│   ├── layout.tsx                # Root layout with custom fonts & metadata
│   ├── page.tsx                  # Modern Dashboard & Interactive Bot Simulator
│   └── globals.css               # Dark theme & glassmorphism styling
├── src/
│   ├── bot/
│   │   ├── bot.ts                # Main grammY bot instance & middleware
│   │   ├── config.ts             # Bot configuration & token validation
│   │   ├── handlers/
│   │   │   ├── start.handler.ts  # /start command (greets & requests phone number)
│   │   │   ├── contact.handler.ts# Contact listener (saves student to Firebase)
│   │   │   ├── menu.handler.ts   # Interactive menus (Grades, Streams, Textbooks)
│   │   │   └── help.handler.ts   # /help and /profile commands
│   │   ├── keyboards/
│   │   │   ├── contact.keyboard.ts # "📱 Share Phone Number" keyboard
│   │   │   └── main.keyboard.ts    # Inline keyboards for navigation & grades
│   │   └── types/
│   │       └── bot.types.ts      # Bot Context types
│   ├── lib/
│   │   ├── firebase/
│   │   │   └── admin.ts          # Firebase Admin SDK singleton with local fallback
│   │   └── db/
│   │       └── user.service.ts   # User Firestore CRUD operations
│   └── types/
│       └── database.ts           # TypeScript interfaces for User and Materials
├── scripts/
│   ├── dev-bot.ts                # Local long-polling bot runner
│   └── set-webhook.ts            # Telegram webhook registration script
├── .env.example                  # Environment variables template
└── .env.local                    # Local environment variables
```

---

## 🚀 Quick Setup Guide

### Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` and follow the instructions to choose a name and username.
3. Copy the HTTP API Token provided (e.g. `7123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`).

### Step 2: Setup Firebase Firestore (Free Spark Plan)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a Project** and follow the prompts.
3. In the left sidebar, navigate to **Build > Firestore Database** and click **Create database** (choose **Start in test mode** or configure rules).
4. Go to **Project Settings (⚙️ icon) > Service Accounts**.
5. Click **Generate new private key** to download your service account credentials JSON file.

### Step 3: Configure Environment Variables

Open `.env.local` and add your credentials:

```env
# Telegram Bot Token
TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"
TELEGRAM_BOT_USERNAME="EthioStudentMaterialBot"

# Next.js App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Firebase Admin Credentials (from your downloaded JSON file)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 🏃 Running the Application

### 1. Run the Telegram Bot locally (Long-Polling Dev Mode):
```bash
npm run bot:dev
```
> ✨ This starts the bot locally in long-polling mode so you can open Telegram, send `/start`, and test the phone number sharing immediately without needing ngrok!

### 2. Run the Next.js Web Dashboard:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live dashboard and interactive simulator.

### 3. Register Webhook for Production (e.g. on Vercel):
```bash
npm run bot:webhook https://your-deployment-url.vercel.app/api/bot
```

---

## 💡 Why Firebase Firestore Spark Plan?

| Feature | Firebase Spark Plan (Free) | Self-Hosted PostgreSQL / Supabase |
| :--- | :--- | :--- |
| **Cost** | **$0.00 / month forever** | Free tier expires or requires active compute |
| **Daily Free Reads** | **50,000 / day** | Limited by connection pool |
| **Daily Free Writes** | **20,000 / day** | Limited by database CPU |
| **Free Document Storage**| **1 GB (500k+ students)** | 500 MB limit on many free DBs |
| **Server Maintenance** | **Zero (Managed by Google Cloud)**| Maintenance & backups required |
| **Next.js Integration**| **Native Serverless Support** | Requires connection pooling (PgBouncer) |
