<div align="center">

# 🏡 MERN Real Estate Project

A polished, production-ready real-estate marketplace built with the MERN stack — search, list, and manage properties with a beautiful, responsive UI.

**Find a place to call home — or list one for others.**

<br />

<a href="https://mern-real-estate-project-client.vercel.app/"><strong>🌐 Live demo — Open the app</strong></a>

<br /><br />

![Demo GIF](https://user-images.githubusercontent.com/000000/placeholder-demo.gif)

</div>

---

## ✨ Highlights

- Clean, responsive UI built with React + Vite and Tailwind CSS
- RESTful API using Express and Node.js
- MongoDB + Mongoose for flexible, scalable data models
- Image uploads powered by Cloudinary
- Email/password authentication + Google sign-in
- Create, update, search, filter, and manage property listings


## 🚀 Features

- Browse listings for rent and sale
- Search and filter by type, price range, furnishing, parking, and offers
- View rich property pages with photo galleries and key details
- Authenticated users can create, edit, and delete their own listings
- Upload property and profile images (Cloudinary)
- JWT-based auth and Firebase for Google OAuth


## 🧰 Tech stack

- Frontend: React, Vite, React Router, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT, Firebase (Google sign-in)
- Storage: Cloudinary


## 📦 Quick start (local)

1. Clone the repo

```bash
git clone https://github.com/habibtariq513/MERN-Real-Estate-Project.git
cd MERN-Real-Estate-Project
```

2. Install dependencies

```bash
npm install
npm install --prefix client
```

3. Create a .env file in the project root with the following values

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
VITE_FIREBASE_API_KEY=your_firebase_api_key
CLOUDINARY_URL=cloudinary_url_or_cloud_name
```

4. Start the backend

```bash
npm run dev
```

5. Start the frontend (in a second terminal)

```bash
cd client
npm run dev
```

The frontend (Vite) typically runs at http://localhost:5173 and the API at http://localhost:3000.


## 🔐 Environment & security

- Never commit .env files or real credentials
- Use strong JWT secrets and secure your MongoDB credentials
- Configure Firebase Authorized Domains to include your deployed domain


## 🛫 Deploying to Vercel

This project is set up to deploy to Vercel. The frontend and API can live in a single Vercel project (serverless functions for the API).

1. Push your repo to GitHub and import into Vercel
2. In Project Settings → Environment Variables, add:
   - MONGO
   - JWT_SECRET
   - VITE_FIREBASE_API_KEY
   - CLOUDINARY_URL (if used)
3. Set the project root to the repository root (where vercel.json lives) and deploy


## 🗂 Project structure

```text
api/                # Vercel serverless function entry for the API
backend/            # Express app, controllers, models, routes
client/             # Frontend (React + Vite)
  src/
    components/
    pages/
    assets/
```


## 💡 Tips & troubleshooting

- If images fail to upload, verify your Cloudinary credentials and CORS/URL settings
- For auth issues, confirm Firebase Authorized Domains include your deployed domain
- Check server logs (or Vercel function logs) for API errors


## 🤝 Contributing

Contributions, issues and feature requests are welcome. Please open an issue or submit a pull request.


## 📄 License

MIT


---

## 🌐 Live demo

Open the deployed demo: https://mern-real-estate-project-client.vercel.app/


---

*Updated README — replaced live link and polished content.*