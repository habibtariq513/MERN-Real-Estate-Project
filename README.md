<div align="center">

# 🏡 Real Estate Project

### Find a place to call home.

Explore homes for sale and rent, discover properties that match your needs, and manage your listings in one welcoming real-estate marketplace.

<br />

<a href="https://mernrealestateproject-dif0ckw0.b4a.run/"><strong>🌐 Visit the live website →</strong></a>

<br /><br />

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-333333?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)

</div>

---

## 🏠 Welcome to Real Estate Project

Real Estate Project is a full-stack real-estate marketplace built with the MERN stack. Browse property listings, filter your search, and create an account to publish and manage your own homes.

Whether you are looking for a rental or your next home, Real Estate Project makes it easy to explore available properties and connect with listing details.

## ✨ What you can do

- 🏘️ **Explore listings** for both sale and rent.
- 🔎 **Search and filter properties** by listing type, special offers, parking, and furnishing.
- 🖼️ **View property details** and browse listing photos.
- 📝 **Create and update listings** with property details, pricing, and features.
- ☁️ **Upload listing and profile images** to Cloudinary.
- 👤 **Manage your account and listings** from your profile.
- 🔐 **Sign in with email and password or Google.**

## 🧰 Built with

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, Firebase Authentication for Google sign-in |
| Image hosting | Cloudinary |

## 🚀 Run it locally

### 📋 Prerequisites

- Node.js and npm
- A MongoDB connection string

### 1️⃣ Install dependencies

From the project root:

```bash
npm install
npm install --prefix client
```

### 2️⃣ Configure the API

Create a `.env` file in the project root:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Keep real credentials private and do not commit your `.env` file.

### 3️⃣ Start the backend

In a terminal at the project root:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

### 4️⃣ Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Vite prints the local website URL when it is ready (usually `http://localhost:5173`).

## 📦 Production build

Build the frontend from the project root:

```bash
npm run build --prefix client
```

The generated static site is written to `client/dist`. The Express app serves this directory when it is available.

## 🗂️ Project structure

```text
api/
  controllers/    Request handlers
  models/         MongoDB models
  routes/         API routes
  utils/          Shared API utilities
client/
  src/
    assets/       Page components and assets
    components/   Shared UI components
    pages/        Marketplace pages
```

## 🌐 Try the live app

**[🏡 Open Real Estate Project](https://mernrealestateproject-dif0ckw0.b4a.run/)**
