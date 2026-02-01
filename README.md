# MindMesh 🧠

**AI-Powered Learning Community Platform**

MindMesh is a Next.js application that connects learners with study partners using AI-driven matchmaking. Join communities, set learning goals, and find accountability partners who share your interests and learning objectives.

## ✨ Features

### 🤝 AI Matchmaking
- **Intelligent Partner Matching**: AI analyzes your learning goals and matches you with compatible study partners
- **Community-Based Matching**: Find partners within specific learning communities
- **Direct Messaging**: Connect with anyone through user search and direct match requests

### 👥 Communities
- **Join Learning Communities**: Browse and join communities focused on different topics (Full Stack, Leadership, AI/ML, DevOps, etc.)
- **Create Communities**: Start your own learning community
- **Community Goals**: Set and track learning goals within each community

### 💬 Real-Time Chat
- **One-on-One Messaging**: Chat with your matched study partners
- **Polling-Based Updates**: Currently uses polling for real-time message updates
- **Match Management**: Accept or decline match requests

> **Note**: Chat currently uses polling for updates. WebSockets and group chat functionality will be implemented in future releases.

### 📊 Dashboard
- **Learning Stats**: Track your active matches, pending requests, and learning goals
- **Quick Access**: Easy navigation to communities and conversations

### 🔐 Authentication
- Powered by [Clerk](https://clerk.com) for secure user authentication
- Support for multiple sign-in methods

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)

### Backend
- **API**: [Hono](https://hono.dev) (lightweight web framework)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [Clerk](https://clerk.com)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai) with Google Gemini

### Development
- **Runtime**: [Bun](https://bun.sh)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Linting**: [ESLint](https://eslint.org)

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- PostgreSQL database
- Clerk account for authentication
- Google AI API key (for AI matchmaking)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mind-mess
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # Google AI (for matchmaking)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   bun run db:generate
   
   # Run migrations
   bun run db:migrate
   
   # (Optional) Seed with sample data
   bun run db:seed
   ```

5. **Run the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database commands
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema changes
bun run db:studio    # Open Drizzle Studio
bun run db:seed      # Seed database with sample data
```

## 📁 Project Structure

```
mind-mess/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main app routes
│   │   ├── chat/          # Chat pages
│   │   ├── communities/   # Community pages
│   │   └── dashboard/     # Dashboard
│   ├── api/               # API routes (Hono)
│   └── server/            # Server-side logic
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── communities/      # Community-specific components
├── database/             # Database schema and migrations
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🎯 Key Features Explained

### AI Matchmaking Algorithm
The AI matchmaking system uses Google's Gemini model to:
1. Analyze user learning goals and interests
2. Compare compatibility between users
3. Generate match recommendations based on:
   - Learning objectives alignment
   - Skill level compatibility
   - Community overlap
   - Availability preferences

### Subscription Tiers
- **Free Tier**: 
  - Join 1 community
  - Set 1 learning goal
  - 2 AI match requests
  
- **Pro Tier**:
  - Unlimited communities
  - Unlimited learning goals
  - Unlimited AI matching

## 🔮 Roadmap

- [ ] **WebSockets Integration**: Replace polling with real-time WebSocket connections
- [ ] **Group Chats**: Multi-user chat rooms within communities
- [ ] **Video Calls**: Integrated video chat for study sessions
- [ ] **Calendar Integration**: Schedule study sessions
- [ ] **Progress Tracking**: Detailed learning progress analytics
- [ ] **Mobile App**: Native iOS and Android applications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- AI powered by [Google Gemini](https://ai.google.dev)

---

**Made with ❤️ for learners everywhere**
