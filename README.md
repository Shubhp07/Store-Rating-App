# Store Rating & Management Application

A modern, full-stack store review and rating web application built with a responsive dashboard, robust permission controls, and real-time statistics. Users can search and rate stores, store owners can view customer feedback metrics, and system administrators can manage all aspects of the application.

---

## 🚀 Key Features

### 👤 Role-Based Portals & Dashboards

1. **System Administrator**
   * **Visual System Overview**: Live cards showing counts of users, stores, and ratings.
   * **User Role Breakdown**: Progress metrics showcasing user types.
   * **Ownership Coverage**: A visual circular gauge indicating the percentage of stores assigned to store owners.
   * **Top Rated Stores Leaderboard**: Leaderboard ranking the top 5 highest-rated stores.
   * **User Management (CRUD)**: Add, edit, delete, or suspend user accounts (suspended users are blocked from logging in or submitting reviews).
   * **Store Management (CRUD)**: Register, update, delete stores, and assign/reassign store owners.

2. **Store Owner**
   * **Feedback Dashboard**: View owned store metrics, average rating, rating count, and list of users who reviewed the store.

3. **Normal User**
   * **Browse Stores**: Search stores by name or address, and sort alphabetically or by highest rating.
   * **Ratings**: Submit a 1-5 star rating or modify an existing rating via a rating modal.

---

## 🛠️ Technology Stack

* **Frontend**: React (v19), Vite, Tailwind CSS, Axios, Lucide React (Icons).
* **Backend**: Node.js, Express, Sequelize ORM, PostgreSQL (`pg`).
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs (password hashing).
* **Database**: PostgreSQL database.

---

## 📦 Project Directory Structure

```text
Store-rating-app/
├── Backend/               # Node.js + Express API
│   ├── config/            # Sequelize database configurations
│   ├── migrations/        # Database migrations (PostgreSQL tables)
│   ├── seeders/           # Default Admin database seeder
│   └── src/
│       ├── config/        # DB connection pooling configuration
│       ├── controllers/   # API request handlers
│       ├── middleware/    # Auth and route protection middlewares
│       └── routes/        # Router groupings (admin, auth, user, owner)
└── Frontend/              # React client
    ├── src/
    │   ├── components/    # Reusable modals, sidebars, structures, skeletons
    │   ├── context/       # Auth state context
    │   ├── hooks/         # Toast notification hooks
    │   ├── pages/         # Page views (Admin, Owner, Users, Auth)
    │   └── utils/         # Input validators and helpers
```

---

## ⚙️ Getting Started & Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **PostgreSQL** database service running locally

---

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory with the following variables:
   ```env
   PORT=5000
   DB_NAME=store_rating_db
   DB_USER=postgres
   DB_PASS=your_postgres_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret_string
   ```

4. Create the PostgreSQL database `store_rating_db` (using pgAdmin, psql, or CLI).

5. Apply database migrations to generate database tables:
   ```bash
   npx sequelize-cli db:migrate
   ```

6. Seed the default System Administrator account (`admin@store.com` / `Admin@123`):
   ```bash
   npx sequelize-cli db:seed:all
   ```

7. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Start the frontend local Vite dev server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`.

---

## 🗄️ Database Tables Schema

* **`users`**: Stores user accounts. Contains columns `id`, `name`, `email`, `password`, `address`, `role` (ENUM: `admin`, `user`, `store_owner`), and `is_suspended` (BOOLEAN).
* **`stores`**: Registered stores. Contains columns `id`, `name`, `email`, `address`, and `owner_id` (foreign key pointing to users table with `ON DELETE SET NULL`).
* **`ratings`**: Store feedback ratings. Contains columns `id`, `user_id`, `store_id`, and `rating` (Integer). Has a unique constraint on `(user_id, store_id)` so users can only rate a store once.

---

## 🔑 Default Administrator Login
* **Email**: `admin@store.com`
* **Password**: `Admin@123`