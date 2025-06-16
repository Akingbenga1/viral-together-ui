# Viral Together UI

A modern Next.js 14 application for the Viral Together influencer marketing platform.

## Features

- 🚀 **Next.js 14** with App Router
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🔐 **Authentication** with JWT tokens
- 📱 **Responsive Design** for all devices
- 🎯 **Influencer Management** - Create, update, and manage influencer profiles
- 🔍 **Advanced Search** - Find influencers by location, language, and more
- 💳 **Rate Card Management** - Handle pricing and rate cards
- 📊 **Analytics Dashboard** - Track performance and metrics
- 💰 **Subscription Management** - Integrated with Stripe

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Viral Together API server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd viral-together-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── Layout/           # Layout components
├── hooks/                # Custom React hooks
│   └── useAuth.ts        # Authentication hook
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts         # Main types
```

## API Integration

The application integrates with the Viral Together API and supports:

- **Authentication**: Login/register with JWT tokens
- **Influencer Management**: CRUD operations for influencer profiles
- **Search & Filtering**: Advanced search capabilities
- **Rate Cards**: Pricing and rate management
- **Subscriptions**: Stripe integration for payments
- **Analytics**: Performance tracking and metrics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 