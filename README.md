# 🥝 KiwiCart

KiwiCart is a full-stack price comparison application for New Zealand supermarkets. It helps users find the best deals by comparing prices across major retailers like Woolworths, New World, and Pak'nSave.

## 🚀 Features

- **Price Comparison:** Real-time lookup of product prices across different supermarkets.
- **Store Locator:** Integrated map view showing supermarket locations (Auckland region).
- **Search:** Quickly find specific products (e.g., "Milk", "Apple").
- **Visual Feedback:** Highlights the cheapest option with a "Best Price!" badge.

## 🛠️ Tech Stack & Technologies

### 🖥️ Frontend (Visuals & State)
- ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React 18** - Component-based UI library
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) **TypeScript** - Static typing for reliable code
- ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white) **TanStack Query** - Server-state management & caching
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling framework
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) **Vite** - Lightning fast build tool

### ⚙️ Backend (Logic & APIs)
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js** - JavaScript runtime
- ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) **Express** - Minimalist web framework
- ![Superagent](https://img.shields.io/badge/Superagent-EF5350?style=flat-square&logo=javascript&logoColor=white) **Superagent** - HTTP client for supermarket API scraping

### 🗄️ Database (Storage)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) **PostgreSQL** - Production relational database
- ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white) **SQLite3** - Lightweight development database
- ![Knex.js](https://img.shields.io/badge/Knex.js-E84545?style=flat-square&logo=knex.js&logoColor=white) **Knex.js** - SQL query builder & migration management

### 🧪 Testing (Reliability)
- ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) **Vitest** - Modern Vite-native testing framework
- ![Supertest](https://img.shields.io/badge/Supertest-41B883?style=flat-square&logo=node.js&logoColor=white) **Supertest** - Integration testing for HTTP endpoints
- ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testing-library&logoColor=white) **React Testing Library** - User-centric component testing
- ![Nock](https://img.shields.io/badge/Nock-90A4AE?style=flat-square&logo=javascript&logoColor=white) **Nock** - HTTP request mocking for unit tests

### 🤖 AI Integration
- ![Gemini](https://img.shields.io/badge/Gemini_AI-8E44AD?style=flat-square&logo=google-gemini&logoColor=white) **Gemini AI** - Smart shopping advice & receipt analysis (Planned/In Progress)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd KiwiCart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup

Initialize the database with migrations and seed data:

```bash
npm run knex migrate:latest
npm run knex seed:run
```

### Running the App

Start both the client and server in development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

To run tests with a UI:

```bash
npm test -- --ui
```

## 📂 Project Structure

- `client/`: React frontend application.
  - `apis/`: API client functions.
  - `components/`: UI components.
  - `styles/`: Global and component styles.
- `server/`: Express backend application.
  - `db/`: Database configuration, migrations, and seeds.
  - `routes/`: API endpoint definitions.
- `models/`: Shared TypeScript interfaces and types.
- `public/`: Static assets (images, etc.).

## 🗺️ Configuration

The map feature currently uses a placeholder API key. To enable the Google Maps integration:
1. Obtain a Google Maps Embed API key.
2. Update the `src` attribute in `client/components/ProductComparison.tsx`.

## 📄 License

ISC
