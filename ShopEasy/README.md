# 🛒 ShopEasy  - Comprehensive E-Commerce Platform

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

ShopEasy is a premium, full-stack, state-of-the-art e-commerce application developed using the MERN stack (MongoDB, Express, React, Node.js) and intricately styled with modern Tailwind CSS properties. It features a seamless shopping cart algorithm, secure checkout workflows, administrative controls, and integrated JWT authentication.

---

## 🚀 Features

- **Storefront & Product Browsing**: High-resolution gallery utilizing modern slide-up micro-interactions, responsive grids, and category filtering logic natively piped to the backend.
- **Secure Authentication Framework**: BCrypt password hashing, session expiration strategies, and strict JWT Bearer token generation.
- **Shopping Cart & Checkout Engine**: Sophisticated frontend quantities interacting with verified, server-side payload calculations to prevent price tampering.
- **Product Reviews & Wishlists**: Clients can leave star ratings and heart favorites caching actively to their profiles.
- **Administrative Portal**: Restricted executives dashboard capable of direct MongoDB `create`, `update`, and `delete` maneuvers.

---

## 💻 Tech Stack
- **Frontend Layer**: React.js, React-Router-Dom, Tailwind CSS, Lucide-React, Axios.
- **Backend Services**: Node.js, Express.js (REST APIs).
- **Database & Security**: MongoDB with Mongoose Schemas, JSON Web Tokens (JWT), BCrypt.js security hashing.

---

## 🛠️ Step-by-Step Local Setup

1. **Clone the repository:**
   Ensure you are in your target directory before cloning.

2. **Backend Setup:**
   - Navigate to the root directory and configure your environment files.
   - Rename `.env.example` to `.env` and assign your connection details (Make sure your local MongoDB instance is active at port 27017, or drop in a MongoDB Atlas URI string).
   - Enter `npm install` in both the root folder, and inside the `/backend` folder.

3. **Frontend Setup:**
   - Open a terminal and navigate to exactly: `cd frontend`
   - Run `npm install`

4. **Seed Mock Database (Crucial First Step):**
   - At the root directory run: `npm run seed --prefix backend`
   - *This command populates your database with our dummy products and an initial admin account.*

5. **Start Development Environments Concurrent Run:**
   - From the root folder, run `npm run dev`
   - *This will securely boot BOTH your Express Backend Server and Vite React Application synchronously.*

---

*This project was carefully architected for scalability, clean RESTful patterns, and high modularity. Perfect for academic submission or portfolio validation.*
