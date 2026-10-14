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
npm run build
```

The generated static site is written to `client/dist`.

## 🚀 Deploy to Vercel

The frontend and API can be deployed together as one Vercel project. The API is exposed as a serverless function at `/api`, and Vercel serves the built frontend and routes client-side pages to `index.html`.

1. Push the project to a GitHub repository and import that repository in Vercel. Set the project root directory to the repository root (the directory containing `vercel.json`).
2. Vercel will use the build command and output directory in `vercel.json`. The build installs the client dependencies and creates `client/dist`; the root `package.json` dependencies are installed by Vercel for the API function.
3. In **Project Settings → Environment Variables**, add:
   - `MONGO`: your MongoDB Atlas connection string.
   - `JWT_SECRET`: a long, random secret used to sign authentication tokens.
   - `VITE_FIREBASE_API_KEY`: your Firebase web app API key.

   Add the variables to the Production environment (and Preview if you want preview deployments to work). Never commit real secrets to the repository.
4. In MongoDB Atlas, allow connections from the deployed app. For a quick setup, configure Network Access to allow access from anywhere (`0.0.0.0/0`) and use a strong database user password; for stricter access control, use an appropriate Vercel egress/networking setup.
5. In Firebase Authentication, add the Vercel domain (for example, `your-project.vercel.app`) to **Authorized domains**.
6. Deploy from Vercel. Subsequent pushes to the connected branch will trigger deployments.
7. Verify the deployed site: browse listings, open a page directly by URL, sign in/out, and test creating or updating a listing. Check Vercel function logs if an API request fails.

The frontend makes same-origin `/api/...` requests, so no separate backend URL or CORS configuration is needed. Vercel's rewrite rules forward those requests to the Express function.

## 🗂️ Project structure

```text
api/
  index.js        Vercel serverless function entry point
backend/
  controllers/    Request handlers
  models/         MongoDB models
  routes/         API routes
  utils/          Shared API utilities
  server.js       Local Express server entry point
client/
  src/
    assets/       Page components and assets
    components/   Shared UI components
    pages/        Marketplace pages
```

## 🌐 Try the live app

**[🏡 Open Real Estate Project](https://mernrealestateproject-dif0ckw0.b4a.run/)**
