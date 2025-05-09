# Only Friends - Social Media Frontend

Only Friends is a modern social media platform designed to help users connect with friends, share moments, and discover new content. This frontend application provides a clean, intuitive user interface for a social networking experience.

## Features

### Authentication & User Management
- User login with phone number verification
- Profile creation and customization
- Password recovery
- Account settings management

### Social Connections
- Friend discovery and management
- Profile viewing
- Friend requests
- Contact synchronization

### Content Sharing
- Post creation with images
- Story sharing
- Feed browsing
- Post interactions (likes, comments)

### User Experience
- Notifications
- Search functionality for finding friends and profiles
- Dark/light mode support
- Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Authentication**: Custom phone verification system
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/only-friends.git
cd only-friends
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. Start the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
only-friends/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── home/             # Home feed
│   ├── profile/          # User profile
│   ├── search/           # Search functionality
│   └── ...               # Other pages
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and services
├── public/               # Static assets
└── ...                   # Configuration files
\`\`\`

## Usage

### Navigating the App

1. **Login**: Start by logging in with your phone number
2. **Home Feed**: Browse posts from friends
3. **Search**: Find friends and other users by name or username
4. **Create**: Share new posts or stories
5. **Profile**: View and edit your profile

### Key Features

- **Stories**: Temporary content that disappears after 24 hours
- **Friend Management**: Add, remove, and view friends
- **Search**: Find users by name, username, or bio
- **Notifications**: Stay updated on friend requests and interactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
