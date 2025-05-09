# Only Friends - Technical Documentation

## Overview

Only Friends is a private social media platform built with Next.js that focuses on genuine connections between real friends. This application uses modern web technologies to create a mobile-first social experience where users connect via phone numbers, share posts and stories, and communicate through direct messages.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Phone number verification with OTP
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind
- **Icons**: Lucide React
- **Routing**: Next.js App Router

## Project Structure

\`\`\`
only-friends/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── create-post/        # Post creation
│   ├── create-profile/     # Profile setup
│   ├── create-story/       # Story creation
│   ├── friend/[id]/        # Friend profile view
│   ├── friends/            # Friends list
│   ├── home/               # Main feed
│   ├── login/              # Authentication
│   ├── messages/           # Direct messages
│   ├── notifications/      # User notifications
│   ├── post/[id]/          # Post detail view
│   ├── profile/            # User profile
│   ├── search/             # Search functionality
│   ├── settings/            # User settings
│   ├── story/[id]/         # Story view
│   ├── verify/             # OTP verification
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # 404 page
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   └── ...                 # Feature-specific components
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Additional styles
├── types/                  # TypeScript type definitions
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/only-friends.git
   cd only-friends
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

   Edit `.env.local` with your configuration:
   \`\`\`
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features and Implementation Details

### Authentication Flow

The authentication system uses phone number verification with OTP:

1. User enters their phone number on the login page
2. An OTP is sent to their phone via Twilio
3. User verifies the OTP to authenticate
4. New users are directed to create a profile
5. Returning users are directed to the home feed

Implementation files:
- `app/login/page.tsx` - Login page
- `app/verify/page.tsx` - OTP verification
- `lib/twilio-service.ts` - Twilio integration
- `context/auth-context.tsx` - Authentication state management

### Navigation System

The app uses a custom navigation system with history tracking:

1. `components/navigation-tracker.tsx` - Tracks navigation history
2. `hooks/use-navigation-history.ts` - Custom hook for navigation
3. `components/back-button.tsx` - Smart back button component

### Direct Messaging

The direct messaging system allows users to chat with friends:

1. `app/messages/page.tsx` - Messages list
2. `app/messages/[id]/page.tsx` - Conversation view
3. `app/messages/new/page.tsx` - New message creation
4. `components/message-bubble.tsx` - Message display component
5. `components/message-input.tsx` - Message input component

## Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

\`\`\`
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
\`\`\`

## Common Issues and Troubleshooting

### 404 Page Rendering Issues

If you encounter issues with the 404 page during build:

1. Ensure all components using `useSearchParams()` are wrapped in a Suspense boundary
2. Check that the `not-found.tsx` file is properly implemented
3. Verify that no components in the layout are using client-side hooks without proper boundaries

### Authentication Issues

If users are having trouble with authentication:

1. Check Twilio credentials and quota
2. Verify the phone number format (international format recommended)
3. Check the verification code storage and retrieval logic

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
