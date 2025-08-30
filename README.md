# Basin Admin - Modern Admin Interface

A comprehensive, production-ready admin interface built with Next.js 15, featuring advanced data management, user administration, and MCP (Model Context Protocol) integration.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture** - Support for multiple organizations with tenant switching
- **Role-Based Access Control** - Granular permissions system with custom roles
- **Data Collections Management** - Visual data modeling with custom field types
- **API Key Management** - Secure API key generation and management
- **User Management** - Complete user lifecycle management
- **Modern Authentication** - JWT-based auth with secure cookie storage

### MCP Integration
- **MCP Server Management** - Configure and monitor Model Context Protocol servers
- **AI Model Management** - Support for GPT-4, Claude, Gemini, and custom models
- **Tool Management** - Manage MCP tools and their configurations
- **Agent Management** - Configure AI agents and their capabilities

### User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Theme** - System-aware theme switching
- **Real-time Updates** - Live data synchronization
- **Intuitive Navigation** - Clean, organized sidebar navigation
- **Search & Filtering** - Advanced data filtering and search capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: TanStack Query (React Query) v5
- **Authentication**: JWT with secure cookie storage
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected admin dashboard
│   │   ├── collections/   # Data collections management
│   │   ├── users/         # User management
│   │   ├── roles/         # Role & permission management
│   │   ├── api-keys/      # API key management
│   │   ├── mcp/           # MCP server & tools management
│   │   └── organization/  # Organization settings
│   ├── login/             # Authentication pages
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── home/             # Landing page components
│   ├── layout/           # Layout & navigation components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities & API client
└── styles/               # Global styles & Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Basin backend running on `http://localhost:8080`

### Installation

```bash
# Clone the repository
git clone https://github.com/treyhulse/basin-admin
cd basin-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```
### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication

The app uses a secure JWT-based authentication system:

- **Login**: Email/password authentication with tenant selection
- **Signup**: User registration with automatic tenant assignment
- **Session Management**: JWT tokens stored in secure HTTP-only cookies
- **Multi-tenancy**: Support for multiple organizations with tenant switching
- **Permission System**: Role-based access control with granular permissions

### Auth Flow
1. User enters credentials on `/login`
2. Backend validates and returns JWT token
3. Token stored in secure cookie
4. Protected routes check authentication status
5. Automatic token refresh and validation

## 📊 Data Management

### Collections
- **Visual Data Modeling**: Create and manage data collections
- **Field Configuration**: Support for various field types (string, integer, boolean, JSON, etc.)
- **Primary Keys**: Designate primary fields for data relationships
- **Validation Rules**: Custom validation for data integrity

### Data Views
- **Custom Views**: Create filtered and aggregated data views
- **API Integration**: Automatic REST API generation for collections
- **Real-time Updates**: Live data synchronization

## 👥 User Administration

### User Management
- **User CRUD**: Create, read, update, and delete users
- **Role Assignment**: Assign users to specific roles
- **Status Management**: Activate/deactivate user accounts
- **Activity Tracking**: Monitor user login and activity

### Role & Permission System
- **Custom Roles**: Create roles with specific permissions
- **Granular Permissions**: Table-level CRUD permissions
- **Permission Inheritance**: Roles inherit permissions from parent roles
- **Dynamic Assignment**: Assign/revoke permissions in real-time

## 🔑 API Key Management

- **Secure Generation**: Cryptographically secure API key generation
- **Permission Scoping**: Limit API key access to specific operations
- **User Association**: Link API keys to specific users
- **Usage Monitoring**: Track API key usage and activity
- **Revocation**: Secure API key revocation

## 🤖 MCP Integration

### Model Context Protocol
- **Server Management**: Configure and monitor MCP servers
- **AI Models**: Support for multiple AI model providers
- **Tool Integration**: Manage MCP tools and their capabilities
- **Agent Configuration**: Set up AI agents with specific tools and models

### Supported Models
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Custom model support

## 🎨 UI Components

Built with shadcn/ui and Tailwind CSS:

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Theme Support**: Dark/light mode with system preference detection
- **Component Library**: Rich set of pre-built, customizable components

## 🔧 API Integration

### REST API Client
- **Automatic Auth**: JWT token injection in requests
- **Error Handling**: Centralized error handling and retry logic
- **Request/Response Interceptors**: Automatic token refresh and error handling
- **Type Safety**: Full TypeScript support with generated types

### API Endpoints
- **Authentication**: `/auth/*` - Login, signup, context
- **Users**: `/items/users` - User CRUD operations
- **Roles**: `/items/roles` - Role management
- **Permissions**: `/items/permissions` - Permission system
- **Collections**: `/items/collections` - Data collection management
- **API Keys**: `/items/api-keys` - API key operations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_SECRET`: Authentication secret (if using NextAuth)
- `NEXTAUTH_URL`: Application URL for authentication callbacks

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Secure token storage
- **CORS Protection**: Configurable cross-origin restrictions
- **Permission Validation**: Server-side permission checking
- **Input Validation**: Zod schema validation for all inputs
- **XSS Protection**: Built-in Next.js security features

## 📈 Performance

- **Next.js 15**: Latest performance optimizations
- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component optimization
- **Caching**: TanStack Query for efficient data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests via GitHub issues
- **Discussions**: Join community discussions for help and ideas

## 🔮 Roadmap

- [ ] Advanced data visualization and charts
- [ ] Workflow automation and triggers
- [ ] Advanced search and filtering
- [ ] Bulk operations and data import/export
- [ ] Real-time collaboration features
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration marketplace

---

Built with ❤️ using Next.js, Tailwind CSS, and shadcn/ui
