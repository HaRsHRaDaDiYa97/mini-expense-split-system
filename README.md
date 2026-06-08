# Mini Expense Split & Settlement System

A full-stack web application that allows users to create groups, add members, record expenses, split expenses among members, calculate balances, and generate settlement suggestions.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Group Management

* Create Group
* View Groups
* View Group Details
* Add Members to Group

### Expense Management

* Add Expenses
* View Expenses
* Split Expenses Among Members

### Summary Calculation

* Calculate each member's net balance in a group

Example:

Harsh paid ₹300 for 3 members.

Result:

* Harsh: +₹200
* Mihir: -₹100
* Jay: -₹100

### Settlement Suggestions

Generate minimal transactions required to settle debts.

Example:

* Mihir → Harsh ₹100
* Jay → Harsh ₹100

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Redux Toolkit
* Tailwind CSS
* React Icons
* Sonner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

---

## Project Structure

project-root/

├── frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── api/

│ ├── routes/

│ └── app/

│

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── utils/

│ ├── config/

│ └── index.js

│

└── README.md

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project-root
```

### Backend Setup

```bash
cd backend

npm install
```


Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/users

### Groups

POST /api/groups

GET /api/groups

GET /api/groups/:id

PUT /api/groups/:id/add-member

### Expenses

POST /api/groups/:id/expenses

GET /api/groups/:id/expenses

### Summary

GET /api/groups/:id/summary

### Settlements

GET /api/groups/:id/settlements

---

## Test Scenario

Users:

* Harsh
* Mihir
* Jay

Create Group:

Rajkot Trip

Add Expense:

Lunch ₹300

Paid By:

Harsh

Result:

Summary:

* Harsh +₹200
* Mihir -₹100
* Jay -₹100

Settlement:

* Mihir → Harsh ₹100
* Jay → Harsh ₹100

---

## Author

Harsh Radadiya

