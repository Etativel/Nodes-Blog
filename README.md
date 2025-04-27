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

- [User Frontend](https://nodes-blog.up.railway.app/posts)
- [Admin Panel](https://nodes-admin.up.railway.app/)

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

#### Admin Panel Setup

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

**Server Environment Variables:**

- `PORT`: API server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for cookie signing
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

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

#### 6. Finalization & Build (April 23–24, 2025)

- **Apr 24**: Search and Database query
  - Replaced client-side filtering with server-side search using Prisma ORM
  - Minor UI refinements for mobile previews and comment styling
  - Add user about Editor, implementing tiptap text editor

## Future Features

- **Content tags**  
  Allow users to pick tags for their content.

- **Follow Tags/Topics**  
  Instead of only following users, people can follow specific tags or topics.

- **User can post images or reels**  
  Allow users to upload and share images, short videos, and reels alongside or instead of blog posts.

- **Direct Messaging**  
  Users can privately message each other, with optional group chat functionality.

- **Story Feature**  
  Users can post 24-hour disappearing content (photos, text, polls, questions).

- **Communities/Groups**  
  Users can create and join communities based on interests (like Reddit subs).

## Contributing

Feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Etativel/Nodes-Blog/blob/main/LICENSE) file for details.

---

© 2025 Etativel. All Rights Reserved.
