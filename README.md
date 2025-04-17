# PeerSphere

A peer tutoring platform that connects university students with qualified peer tutors.

## Features

- **Students**: Find tutors, book sessions, track progress
- **Tutors**: Manage availability, track sessions, view earnings
- **Admins**: Approve tutors, monitor sessions, view analytics

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Tech Stack

- React & Vite
- Tailwind CSS
- React Router
- Context API for state

## Structure

```
src/
├── components/        # UI components by user role
├── context/           # App state management
├── data/              # Mock data (JSON)
├── layouts/           # Layout components
├── pages/             # Page components by user role
└── App.jsx            # Main app component with routing
```

## Demo Users

For demo purposes, you can switch between roles using the role selector.

## Deployment

This project is configured for deployment on Vercel.