# Expense Split & Settlement System (Pro)

A production-grade, full-stack Expense Split & Settlement application built with the MERN stack (React, Redux Toolkit, Tailwind CSS, Node.js, Express, MongoDB). The system incorporates advanced splitting modes, visual analytics, robust security features, role-based member permissions, and partial settlement tracking with payment logs and bill receipts.

---

## 🌟 Key Features

### 1. Modern SaaS Dashboard & Interface
* **Responsive Layout**: Designed for mobile-first views, tablets, and desktop displays.
* **Landing Page**: Public hero landing page with features list, workflow guides, testimonials, and FAQs.
* **Metrics Summary**: Overview of active groups, unique members, and group category breakdowns.
* **Visual Skeletons & Boundaries**: Seamless skeleton loaders for data fetching states and global error boundaries for safe recovery.

### 2. Group & Member Management
* **Role-Based Access Control**: Members have roles (`owner`, `admin`, `member`) with strict capability permissions (e.g., only owners/admins can add/remove members).
* **Ownership Transfer**: Group owners can securely promote another member to owner, demoting themselves to admin.
* **Archive & Retrieve**: Owners can archive old or inactive groups to keep the dashboard clutter-free.

### 3. Advanced Splitting Modes
* **Equal Split**: Cost split evenly among selected members.
* **Unequal Split**: Assign exact, custom monetary amounts to specific members.
* **Percentage Split**: Split costs based on percentage allocations (summing to 100%).
* **Share Split**: Allocate integer shares of the total amount (e.g., 2 shares for A, 1 share for B).
* **Residual Rounding Protection**: Splitting algorithms automatically adjust for decimal division remainders by shifting the residual fraction to the final member, avoiding database rounding mismatches.

### 4. Smart Settlements & Recording
* **Minimum Payment Pathing**: An optimized debt-settlement pathing algorithm calculates the minimal transaction sequence required to resolve group debts.
* **Partial Settlement Support**: Log partial payment amounts, automatically recalculating outstanding balances.
* **Payment Log History**: Tracks recorded settlements with notes, transaction times, and payment receipt attachments.
* **Cloudinary Receipt Upload**: Drag-and-drop or select receipt image uploads directly when logging expenses or recording payments.
* **Local upload fallback**: Automatically falls back to local uploads under `/uploads` if Cloudinary configuration is missing, ensuring out-of-the-box operation.

### 5. Analytics & Visual Insights
* **Spending over Time**: Chronological monthly spending charts using Recharts.
* **Category Breakdown**: Interactive pie chart showing expense allocations by category (Food, Hotel, Transport, Fuel, Shopping, etc.).
* **Member Contributions**: Contribution bar chart visualizing total spending of each user.
* **Insight Highlights**: Metric indicators displaying the single highest expense, the top spending category, and the most active member in the group.

### 6. Notifications Feed
* **In-App Notification Center**: Instant real-time alerts whenever you are added to a group, when expenses are logged, or when settlements are processed.
* **Mark as Read**: Quick actions to dismiss notifications globally or individually.

### 7. Security & Input Validation
* **Security Headers**: Helmet middleware integrations on express routes.
* **Anti-Mongo Injection & Safe Sanitization**: Custom recursive middleware to strip potential `$`, `.`, and XSS HTML tags cleanly without breaking execution query getters.
* **Rate Limiting**: Custom route rate limits to protect authentication endpoints from brute force attempts.
* **Strict Validation**: API inputs validated using `express-validator` schemas.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Redux Toolkit, React Router DOM, Axios, Tailwind CSS, Lucide React, Recharts, Sonner Toasts
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer, Cloudinary
* **Testing**: Jest & Supertest (Backend), Vitest & React Testing Library (Frontend)

---

## ⚙️ Local Configuration & Setup

### Clone the Repository
```bash
git clone "https://github.com/HaRsHRaDaDiYa97/mini-expense-split-system.git"
cd mini-expense-split-system
```

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_secure_jwt_secret
   
   # Optional: Cloudinary configuration for receipt uploads
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   *Note: If Cloudinary variables are left unset, files will upload locally to `backend/uploads/`.*
4. Start the backend developer server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the frontend Vite server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

## 🧪 Running Tests

### Backend Tests (Jest)
Run backend tests to verify authentication, group operations, settlements, and advanced splits calculations:
```bash
cd backend
npm run test
```

### Frontend Tests (Vitest)
Run frontend component tests for Login, Register page checks, password strength meter, and Dashboard interactions:
```bash
cd frontend
npm run test
```

---

## 🚀 Deployment Guide

### 1. Database Deployment (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free shared cluster.
2. In **Network Access**, whitelist all IPs (`0.0.0.0/0`) or your specific deployment host server IP.
3. In **Database Access**, create a user credentials set (keep user/password handy).
4. Copy the connection string (format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority`) and paste it as the `MONGO_URI` variable in your production configuration.

### 2. Backend Deployment (Render or Heroku)
1. Link your GitHub repository to your [Render](https://render.com) account.
2. Create a new **Web Service**, select the repo, and navigate to the backend subdirectory:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
3. Under **Environment Variables**, define `MONGO_URI`, `JWT_SECRET`, and optionally Cloudinary credentials.
4. Render will deploy and allocate a public URL (e.g., `https://expense-api.onrender.com`).

### 3. Frontend Deployment (Vercel or Netlify)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository, then customize settings for the frontend subdirectory:
   * **Root Directory**: `frontend`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. In **Environment Variables**, add:
   * `VITE_API_URL` = `https://your-backend-api-url.onrender.com/api`
4. Click **Deploy**. Vercel will build and serve your static React bundle.

---

## 👥 Contributors & Authors

* **Harsh Radadiya** - *Original Author & Software Engineer*
