# Nodes Blog Platform

<p align="center">
  <img src="./public/Nodes_icon.png" alt="Nodes Platform" width="250" height="250" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)

## Overview

Nodes is a blogging platform where writers can easily share their ideas, stories, and insights. It includes secure authentication, a straightforward interface, and tools for managing content and users.

## Table of Contents

- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Live Demo

**Production Environment:**

- [User Portal](https://nodes-blog-user-frontend.up.railway.app/posts)
- [Administration Panel](https://nodes-blog-admin-frontend.up.railway.app/)

## Key Features

### User Experience

- **Authentication System**: Secure JWT-based authentication with cookie sessions
- **Content Interaction**: Reading, commenting, bookmarking, and reactions
- **Profile Management**: Customizable profiles with follow system
- **Theme Personalization**: Toggleable light/dark mode preference

### Content Management

- **Article Creation**: Rich text editing with image upload capabilities
- **Publishing Controls**: Draft/publish workflow
- **Content Moderation**: Community-based reporting system
- **Engagement Metrics**: Track likes, comments, and bookmarks

### Administration

- **Analytics Dashboard**: Comprehensive statistics and metrics
- **User Management**: User oversight with suspension capabilities
- **Content Moderation**: Post and comment moderation tools
- **Featured Content**: Curated content promotion system
- **Security Controls**: Role-based access control (User, Admin, SuperAdmin)

## Technical Architecture

### Infrastructure

<p align="center">
  <img src="./public/Nodes architecture.png" alt="Nodes Platform"  width="650" height="180" />
</p>

### Technology Stack

#### Backend Infrastructure

- **Runtime Environment**: Node.js
- **API Framework**: Express.js v4.21.2
- **Authentication**: JWT with Passport.js v0.7.0
- **Data Storage**: PostgreSQL with Prisma ORM v6.4.1
- **Media Management**: Multer + Cloudinary for asset handling
- **Security Measures**: express-rate-limit, CSRF protection, secure cookies

#### User Interface

- **Frontend Framework**: React v19.0.0 with Vite v6.2.0
- **State Management**: React Context API
- **Styling Architecture**: CSS
- **HTTP Client**: Native fetch API
- **Rich Text Editor**: TinyMCE v7.8.0

#### Administration Interface

- **Frontend Framework**: React.js
- **UI Component Library**: Material UI
- **Styling**: Tailwind CSS
- **Data Visualization**: chart js

#### Development & Operations

- **Environment Management**: dotenv v16.4.7
- **Development Tooling**: ESLint v9.21.0, Vite, Prisma CLI
- **Deployment Platform**: Node.js with serve for static asset hosting

## Getting Started

### System Requirements

- Node.js v16.0.0 or higher
- PostgreSQL installed and configured
- npm v7.0.0 or higher

### Installation Process

#### API Server Setup

```bash
# Clone the repository
git clone git@github.com:Etativel/Nodes-Blog.git

# Navigate to server directory
cd Nodes-Blog/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

#### User Interface Setup

```bash
# Navigate to client directory
cd ../user-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

#### Administration Panel Setup

```bash
# Navigate to admin directory
cd ../admin-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

### Environment Configuration

The application requires several environment variables for proper operation:

**Server Environment Variables:**

- `PORT`: API server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for cookie signing
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## API Reference

### Authentication Endpoints

#### User Authentication

| Endpoint        | Method | Description                    | Authentication |
| --------------- | ------ | ------------------------------ | -------------- |
| `/auth/login`   | POST   | User authentication            | None           |
| `/auth/logout`  | POST   | End user session               | Required       |
| `/auth/profile` | GET    | Retrieve authentication status | Required       |

#### Administrative Authentication

| Endpoint         | Method | Description                          | Authentication |
| ---------------- | ------ | ------------------------------------ | -------------- |
| `/admin/login`   | POST   | Administrator authentication         | None           |
| `/admin/logout`  | POST   | End administrator session            | Required       |
| `/admin/profile` | GET    | Retrieve admin authentication status | Required       |

### User Management

| Endpoint                            | Method | Description                 | Authentication   |
| ----------------------------------- | ------ | --------------------------- | ---------------- |
| `/users/check-username`             | POST   | Username availability check | None             |
| `/users/check-email`                | POST   | Email availability check    | None             |
| `/users/create`                     | POST   | User registration           | None             |
| `/users/:userId`                    | GET    | Retrieve user profile       | Required         |
| `/users/user-by-username/:username` | GET    | Profile by username         | Required         |
| `/users/`                           | GET    | List all users              | Required         |
| `/users/update/:userId`             | PATCH  | Update user information     | Required + Owner |
| `/users/profile/update`             | PATCH  | Update profile with image   | Required         |
| `/users/follow`                     | PATCH  | Follow user                 | Required         |
| `/users/unfollow`                   | PATCH  | Unfollow user               | Required         |
| `/users/toggle-theme/:userId`       | POST   | Update theme preference     | Required         |
| `/users/get-theme/:userId`          | GET    | Retrieve theme preference   | Required         |

### Content Management

| Endpoint                          | Method | Description            | Authentication   |
| --------------------------------- | ------ | ---------------------- | ---------------- |
| `/posts/`                         | GET    | List all posts         | Required         |
| `/posts/:postId`                  | GET    | Retrieve specific post | Required         |
| `/posts/by/:username`             | GET    | User's posts           | Required         |
| `/posts/filter`                   | GET    | Filtered post list     | Required         |
| `/posts/featured-n-trending-post` | GET    | Featured content       | Required         |
| `/posts/create`                   | POST   | Create new post        | Required         |
| `/posts/:postId/like`             | POST   | Toggle post like       | Required         |
| `/posts/:postId/bookmark`         | POST   | Toggle bookmark        | Required         |
| `/posts/report/:postId`           | POST   | Report post            | Required         |
| `/posts/feature-post/:postId`     | POST   | Set featured status    | Admin            |
| `/posts/update/:postId`           | PUT    | Modify post            | Required + Owner |
| `/posts/publish/:postId`          | PUT    | Toggle publish status  | Required + Owner |
| `/posts/delete/:postId`           | DELETE | Remove post            | Required + Owner |

### Comment System

| Endpoint                      | Method | Description               | Authentication   |
| ----------------------------- | ------ | ------------------------- | ---------------- |
| `/comments/`                  | GET    | List all comments         | Required         |
| `/comments/:commentId`        | GET    | Retrieve specific comment | Required         |
| `/comments/create`            | POST   | Add comment               | Required         |
| `/comments/reaction/toggle`   | POST   | Toggle reaction           | Required         |
| `/comments/report/:commentId` | POST   | Report comment            | Required         |
| `/comments/update/:commentId` | PATCH  | Modify comment            | Required + Owner |
| `/comments/delete/:commentId` | DELETE | Remove comment            | Required + Owner |

### Administrative Endpoints

#### Dashboard Analytics

| Endpoint                                | Method | Description              | Role  |
| --------------------------------------- | ------ | ------------------------ | ----- |
| `/admin-panel/dashboard/all-stats`      | GET    | Comprehensive statistics | Admin |
| `/admin-panel/dashboard/summary`        | GET    | Summary metrics          | Admin |
| `/admin-panel/dashboard/reports`        | GET    | Report analysis          | Admin |
| `/admin-panel/dashboard/post-status`    | GET    | Content status overview  | Admin |
| `/admin-panel/dashboard/recent-reports` | GET    | Recent moderation items  | Admin |
| `/admin-panel/dashboard/user/:userId`   | GET    | User-specific analytics  | Admin |

#### User Administration

| Endpoint                                          | Method | Description               | Role       |
| ------------------------------------------------- | ------ | ------------------------- | ---------- |
| `/admin-panel/users/all-users`                    | GET    | User management interface | Admin      |
| `/admin-panel/users/update-user/:userId`          | PUT    | Modify user account       | SuperAdmin |
| `/admin-panel/users/suspend-user/:userId`         | POST   | Suspend user account      | SuperAdmin |
| `/admin-panel/users/lift-suspension-user/:userId` | POST   | Reinstate account         | SuperAdmin |

#### Content Administration

| Endpoint                                          | Method | Description                  | Role       |
| ------------------------------------------------- | ------ | ---------------------------- | ---------- |
| `/admin-panel/posts/all-posts`                    | GET    | Content management interface | Admin      |
| `/admin-panel/posts/update-status/:postId`        | POST   | Update publication status    | SuperAdmin |
| `/admin-panel/comments/all-comments`              | GET    | Comment management interface | Admin      |
| `/admin-panel/comments/delete-comment/:commentId` | DELETE | Remove comment               | Admin      |

## Development Roadmap

#### 1. Project Initialization (March 2–6, 2025)

- **Mar 2**: Project scaffolding & package setup
  - Initialized React application and project structure (`react app initialization`)
  - Added basic routing and API endpoints for posts and comments (`add posts routes`, `CRUD for posts`)
- **Mar 3–4**: Core data models & controllers
  - Implemented CRUD operations for posts, comments, and user entities
  - Introduced filtering logic for post feeds

#### 2. Content Creation & Media Handling (March 12–15, 2025)

- **Mar 12**: Image upload & asset management
  - Integrated Cloudinary for post images
  - Added thumbnail and excerpt fields to posts
- **Mar 13–15**: Post editing experience
  - Enabled write & preview functionality (TinyMCE)
  - Responsive image selection and preview improvements

#### 3. User Experience & Styling (March 16–23, 2025)

- **Mar 16–17**: Landing and post pages
  - Styled landing page, post page layouts, and reading-time estimates
- **Mar 18–20**: Authentication & Profile
  - Built sign-in/up dialogs, user validation, and session management
  - Added profile page, dropdown menu, and image upload for user avatars

#### 4. Interaction & Engagement (April 4–9, 2025)

- **Apr 4–6**: Comments & replies
  - Implemented comment posting, nesting, editing, and deletion
  - Added like/bookmark toggles for posts and comments
- **Apr 8–9**: Reaction reliability
  - Fixed double-click toggle issues and cascade deletion for reactions

#### 5. Admin Panel & Role Management (April 14–21, 2025)

- **Apr 14–16**: Admin interface setup
  - Created dashboard panel, user and comment management pages
  - Configured Material UI components and Tailwind CSS styling
- **Apr 18–21**: Security & permissions
  - Introduced superadmin/admin/user roles with suspension and activation
  - Configured route protection, CORS, rate limiting, and cookie-based auth

#### 6. Finalization & Build (April 22–23, 2025)

- **Apr 22**: Build pipeline & CI adjustments
  - Updated redirection URLs, port configurations, and static assets
  - Minor UI refinements for mobile previews and comment styling
- **Apr 23**: Documentation & deployment
  - Added comprehensive README file and updated admin redirection logic
  - Production build and deployment scripts integrated

## Contributing

Feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact Information

- **Project Maintainer:** [Farhan](farhanmaulana4611@gmail.com)
- **GitHub Repository:** [https://github.com/Etativel/Nodes-Blog](https://github.com/Etativel/Nodes-Blog)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Etativel/Nodes-Blog/blob/main/LICENSE) file for details.

---

© 2025 Etativel. All Rights Reserved.
