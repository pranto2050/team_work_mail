# Information Collector Manager

A secure, modern credential manager designed for development teams to store and manage shared test accounts and credentials.

![Project Demo](Project%20Demo.png)

## 🚀 Features
- **Team Management:** Add, manage, and search team members easily.
- **Credential Storage:** Store test accounts, labels, emails, usernames, and passwords securely for each member.
- **Modern UI/UX:** Responsive, glassmorphism-inspired design for a clean user experience.
- **Real-time Search:** Instantly filter members by name or role.

## 🛠️ Tech Stack
- Frontend: React, Vite, TypeScript
- Styling: CSS Modules / Inline Styles with a Glassmorphism theme
- Backend/Database: Supabase
- Deployment: Vercel

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd team_work_mail
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your environment variables.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view it in the browser.

## 🚀 Deployment

This project is ready to be deployed on **Vercel**. 

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Add these Environment Variables in Vercel (Production, Preview, Development):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL` (same value as `VITE_SUPABASE_URL`)
   - `SUPABASE_PUBLISHABLE_KEY` (same value as `VITE_SUPABASE_PUBLISHABLE_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; required for admin/server routes)
4. Click Deploy!
