# HelpDesk Pro - Customer Support Platform

A complete helpdesk web application built with React, Convex, and Clerk for modern customer support teams.

## Features

### 🔐 Authentication & Roles

- **Clerk Integration**: Email/password + OAuth providers (Google, GitHub, etc.)
- **Role-based Access**: User, Agent, Admin roles with different permissions
- **Automatic User Creation**: Seamless onboarding for new users

### 🎫 Ticketing System

- **Create Tickets**: Users can submit detailed support requests with priorities
- **Ticket Management**: Agents can assign, update status, and manage tickets
- **Real-time Updates**: Live synchronization across all connected clients
- **Search & Filters**: Full-text search with status, priority, and assignment filters

### 💬 Comments & Communication

- **Public Comments**: Visible to ticket creators and agents
- **Internal Notes**: Agent-only comments for team collaboration
- **Real-time Chat**: Instant updates when new comments are added
- **Rich Formatting**: Support for formatted text and line breaks

### 📊 Role-based Dashboards

- **User Dashboard**: Personal ticket overview and creation
- **Agent Dashboard**: Queue management and assignment tools
- **Admin Dashboard**: System overview with team metrics and analytics

### 🎨 Modern Design

- **Tailwind CSS v4**: Latest version with @theme directive
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Semantic Color System**: Consistent theming with primary, secondary, accent colors
- **Smooth Animations**: Polished interactions and transitions

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Convex (database, queries, mutations)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Language**: JavaScript (ES2022+)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account
- Convex account

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd helpdesk-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

   Follow the prompts to create a new Convex project and get your deployment URL.

4. **Set up Clerk**
   - Go to [clerk.com](https://clerk.com) and create a new application
   - Copy your publishable key from the dashboard

5. **Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

### Deployment

#### Convex Deployment

Your Convex backend is automatically deployed when you run `npx convex dev`. For production:

```bash
npx convex deploy --prod
```

#### Frontend Deployment

Build the app for production:

```bash
npm run build
```

Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.).

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── ...
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── UserDashboard.jsx
│   │   ├── AgentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   └── tickets/           # Ticket-related components
│       └── CommentSection.jsx
├── pages/
│   ├── auth/              # Authentication pages
│   │   ├── SignInPage.jsx
│   │   └── SignUpPage.jsx
│   ├── dashboard/         # Dashboard pages
│   │   └── DashboardPage.jsx
│   └── tickets/           # Ticket pages
│       ├── TicketListPage.jsx
│       ├── TicketDetailPage.jsx
│       └── CreateTicketPage.jsx
├── layouts/               # Layout components
│   ├── AuthLayout.jsx
│   └── MainLayout.jsx
├── hooks/                 # Custom React hooks
│   └── useCurrentUser.jsx
└── styles/               # CSS files
    └── index.css

convex/
├── schema.js             # Database schema
├── users.js             # User-related functions
├── tickets.js           # Ticket management
└── comments.js          # Comment system
```

## Key Features Explained

### Role-based Access Control

The app implements a comprehensive role system:

- **Users**: Can create and view their own tickets
- **Agents**: Can view all tickets, assign to themselves, update status
- **Admins**: Full access to all features plus user management

### Real-time Functionality

Built with Convex's reactive queries, the app provides:

- Live ticket updates across all connected clients
- Real-time comment synchronization
- Instant status and assignment changes
- Live notification counters

### Search and Filtering

Advanced filtering capabilities include:

- Full-text search across ticket titles and descriptions
- Filter by status (open, pending, resolved, closed)
- Filter by priority (low, medium, high, urgent)
- Filter by assigned agent
- Combined filters for precise results

### Comment System

Sophisticated commenting with:

- Public comments visible to ticket creators and agents
- Internal notes for agent-only collaboration
- Role-based visibility controls
- Timestamps and user attribution
- Rich text formatting support

## Customization

### Styling

The app uses Tailwind CSS v4 with semantic color tokens. Customize the theme in `src/index.css`:

```css
@theme {
  --color-primary-500: #your-brand-color;
  --color-secondary-500: #your-secondary-color;
  /* ... */
}
```

### Roles and Permissions

Modify role logic in:

- `convex/users.js` - User creation and role assignment
- Component props - Role-based rendering
- `src/components/ui/Sidebar.jsx` - Navigation items per role

### Database Schema

Update the schema in `convex/schema.js` to add new fields or tables as needed.

## API Reference

### Convex Functions

#### Users

- `getCurrentUser({ clerkId })` - Get user by Clerk ID
- `createUser({ clerkId, email, name, role })` - Create new user
- `getAllAgents()` - Get all agents and admins

#### Tickets

- `getTickets({ userId?, userRole, status?, priority?, assignedTo? })` - Get filtered tickets
- `getTicketById({ ticketId })` - Get single ticket with user info
- `createTicket({ title, description, priority, userId })` - Create new ticket
- `updateTicket({ ticketId, status?, assignedTo?, priority? })` - Update ticket
- `searchTickets({ searchTerm, userRole, userId? })` - Full-text search

#### Comments

- `getCommentsByTicket({ ticketId, userRole })` - Get ticket comments
- `addComment({ ticketId, userId, content, isInternal })` - Add comment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the GitHub issues
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using React, Convex, and Clerk
