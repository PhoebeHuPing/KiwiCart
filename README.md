# 🥝 KiwiCart

KiwiCart is a full-stack price comparison application for New Zealand supermarkets. It helps users find the best deals by comparing prices across major retailers like Woolworths, New World, and Pak'nSave.

## 🚀 Features

- **Price Comparison:** Real-time lookup of product prices across different supermarkets.
- **Store Locator:** Integrated map view showing supermarket locations (Auckland region).
- **Search:** Quickly find specific products (e.g., "Milk", "Apple").
- **Visual Feedback:** Highlights the cheapest option with a "Best Price!" badge.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, React Query, Vite.
- **Backend:** Node.js, Express.
- **Database:** SQLite3, Knex.js.
- **Testing:** Vitest, Testing Library.
- **Styling:** CSS3.

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
