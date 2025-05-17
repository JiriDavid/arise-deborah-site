# Arise Deborah Church Website

A modern, responsive church website built with Next.js, Clerk for authentication, and MongoDB for data storage.

## Features

- Modern, responsive design with animations
- Sermon archive with video playback
- Event calendar and registration
- Online giving system
- Prayer request submission
- Member portal
- Blog section
- Live streaming integration

## Tech Stack

- Next.js 14 (App Router)
- Clerk for authentication
- MongoDB for database
- Tailwind CSS for styling
- Framer Motion for animations
- React Player for video playback

## Prerequisites

- Node.js 18.x or later
- MongoDB database
- Clerk account for authentication
- Google Maps API key (for location features)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/arise-deborah-site.git
cd arise-deborah-site
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
MONGODB_URI=your_mongodb_connection_string_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (routes)/           # Route groups
├── api/               # API routes
├── components/        # Reusable components
├── lib/              # Utility functions
├── models/           # MongoDB models
├── styles/           # Global styles
└── utils/            # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
