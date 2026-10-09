# SlotBook

SlotBook is a booking and scheduling platform concept for small service businesses such as clinics, salons, tutors, and independent professionals. The goal is to make it easy for customers to discover services and for businesses to manage appointment availability.

> **Project status:** Backend starter implementation. Authentication, service-management routes, MongoDB connection, and health/protected routes are present. The complete customer booking flow, slot-conflict protection, admin dashboard, and frontend are planned follow-up work and should not be considered finished yet.

## Current tech stack

- **Runtime:** Node.js
- **API:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Configuration:** environment variables via `.env`

## Current repository structure

```text
SlotBook/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Service.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── protectedRoutes.js
│   │   └── serviceRoutes.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── .env.example
└── README.md
```

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm
- A MongoDB database, either local or MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/vivekreddy-03/SlotBook.git
cd SlotBook
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend` directory. Use the root `.env.example` as a reference and configure the values expected by the backend, including your MongoDB connection string and JWT secret. **Never commit real credentials or API keys.**

Example values (replace them with your own):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/slotbook
JWT_SECRET=replace-with-a-long-random-secret
```

Check `backend/server.js` and `backend/config/db.js` for the exact environment variable names used by the current code.

### 4. Start the API

From the `backend` directory, run the start script defined in `package.json`, for example:

```bash
npm run dev
```

If no development script is configured, run:

```bash
node server.js
```

Use the health endpoint configured in `backend/routes/healthRoutes.js` to check that the API is responding.

## Intended product features

The longer-term SlotBook roadmap includes:

- Customer registration and login
- Service listings and service details
- Business working hours and unavailable dates
- Available appointment-slot generation
- Booking, cancellation, and rescheduling
- Prevention of double-booking
- Customer appointment history
- Business/admin dashboard
- Optional booking notifications

These are roadmap goals; only features implemented in the source code should be treated as available.

## Security notes

- Keep `.env` files out of Git.
- Use a unique, strong JWT secret outside local development.
- Use a dedicated MongoDB database user with limited permissions.
- Validate all incoming request data and enforce authorization on protected endpoints.
- Before deploying publicly, review error handling, rate limiting, CORS, logging, and production configuration.

## Contributing

This is a learning project. Issues and pull requests that improve API reliability, validation, documentation, tests, or the booking workflow are welcome.

## License

See [LICENSE](LICENSE) for the project license.
