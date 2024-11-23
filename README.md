# IronWolf Ordering System

A modern web application for managing sublimation orders with features like order tracking, history, and job management.

## Features

- Secure login system with admin password and employee profiles
- Dashboard with quick access to all features
- Create and manage orders with automated job numbering
- Track order history and status
- Manage job lists and sizes
- Dynamic sublimation order creation with price calculation
- Local SQLite database for data storage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install frontend dependencies:
```bash
cd ironwolf-ordering-system
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd ironwolf-ordering-system
npm start
```
The application will open in your browser at http://localhost:3000

## Default Login

- Admin Password: admin123
- Select any employee profile after login

## Technologies Used

- Frontend:
  - React with TypeScript
  - Material-UI for design
  - Redux Toolkit for state management
  - React Router for navigation
  - Framer Motion for animations

- Backend:
  - Node.js with Express
  - SQLite database
  - REST API endpoints

## Project Structure

- `/src` - Frontend React application
  - `/components` - React components
  - `/features` - Redux slices and features
  - `/types` - TypeScript type definitions
  - `/store` - Redux store configuration

- `/server` - Backend Node.js application
  - `server.js` - Express server setup
  - `database.sqlite` - SQLite database file
