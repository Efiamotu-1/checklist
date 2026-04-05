# Integrity System

![Integrity System](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black)
![Supabase](https://img.shields.io/badge/Backend-Supabase-blueviolet)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38b2ac)

> **"Integrity is doing the right thing, even when no one is watching."**

The **Integrity System** is a high-performance, mission-critical task management platform designed to help high-achievers maintain absolute reliability. Unlike traditional checklists, the Integrity System prioritizes tasks based on time-sensitive commitments, categorizing them into a logical workflow that ensures nothing slips through the cracks.

---

## 🌟 Key Features

### ⚔️ Core Workflow
- **Daily Focus**: A dedicated space for today's essential missions.
- **Upcoming Missions**: Visibility into future commitments so you're always one step ahead.
- **Lingering Concerns**: Automatic detection of overdue tasks. This section only appears when integrity is at risk, serving as a pulse-pounding reminder to recalibrate.
- **Historical Record**: A full audit trail of your past successes.

### 🧠 Intelligence & UX
- **Integrity Rating**: A real-time percentage score reflecting your reliability based on task completion.
- **Task Detail Modal**: Premium, high-focus view for complex tasks with truncated titles.
- **Smart Calendar**: Restrictive date selection that prevents "rewriting history"—you can only set missions for today or the future.
- **Dark Mode Narrative**: A sleek, focused aesthetic designed for deep work and high-stakes performance.

---

## 🛠 Developer Guide

This project is built with a modern, scalable stack focused on type safety and real-time synchronization.

### Tech Stack
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **State Management**: [TanStack React Query v5](https://tanstack.com/query/latest) (Server-state synchronization)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (HeroIcons v2)

### Prerequisites
- Node.js (v18+)
- A Supabase project

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Efiamotu-1/checklist.git
   cd checklist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

### Architecture Overview
- **Services Layer**: Centralized API logic in `src/services/` (Auth, Tasks).
- **Hooks Layer**: Custom React Query hooks in `src/hooks/` for seamless data fetching and mutation with automatic cache invalidation.
- **Component Pattern**: Atomic components in `src/components/` utilizing Tailwind for modular, premium styling.
- **Database Schema**:
  - `tasks` table: `id`, `user_id`, `title`, `description`, `status` (pending, halfway, completed), `priority`, `due_date`, `completed_at`.

---

## 🚀 Deployment

The Integrity System is optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Add your `NEXT_PUBLIC_` environment variables in the Vercel dashboard.
3. Deploy.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
