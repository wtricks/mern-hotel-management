# MERN Hotel Management

A full-stack hotel management system built using the MERN stack (MongoDB, Express, React, Node.js).

## Demo

Live url: [visit](https://mern-hotel-management-indol.vercel.app/)

```bash
# Admin User
email: admin@site.com
password: 123456

# Guest user
email: user@site.com
password: 123456
```

## Project Structure

- **client/**: Frontend of the project (React + Vite)
- **server/**: Backend of the project (Node.js + Express)

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **pnpm**: [Install pnpm](https://pnpm.io/installation)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community)

## Cloning the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/wtricks/mern-hotel-management.git
cd mern-hotel-management
```

## Setting Up the Project

### 1. Frontend (Client)

Navigate to the `client/` directory:

```bash
cd client
```

Create a `.env` file in the `client/` directory and add the following:

```bash
VITE_API_URL=http://localhost:5000
```

Install dependencies using `pnpm`:

```bash
pnpm install
```

### 2. Backend (Server)

Navigate to the `server/` directory:

```bash
cd ../server
```

Create a `.env` file in the `server/` directory and add the following:

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/hoteldb
JWT_SECRET=1EF392369D6233196CF726E8C5688
PORT=5000
```

Install dependencies using `pnpm`:

```bash
pnpm install
```

## Running the Project

To run the project in development mode:

1. **Start the client (frontend):**

   Open a terminal and run the following command from the `client/` directory:

   ```bash
   pnpm dev
   ```

2. **Start the server (backend):**

   In another terminal, navigate to the `server/` directory and run:

   ```bash
   pnpm dev
   ```

Both the frontend and backend servers should now be running on:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Package Manager**: pnpm

## License

This project is licensed under the [MIT License](LICENSE)

### Instructions

- Replace the empty Stripe keys in `.env` with your actual keys.
- The project uses `pnpm` for dependency management, so make sure to install it.
