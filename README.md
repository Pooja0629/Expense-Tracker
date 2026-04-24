# 💰 Expense Tracker – Personal Finance Management System

## 📑 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Installation](#installation)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Database Schema](#database-schema)
* [Project Structure](#project-structure)
* [Deployment](#deployment)
* [Future Improvements](#future-improvements)
* [License](#license)
* [Contact](#contact)

---

## 📌 Overview

Expense Tracker is a full-stack web application designed to help users efficiently manage their daily expenses and track financial activity. It provides a clean dashboard, secure authentication, and real-time updates for better financial insights.

The application enables users to add, view, and manage expenses, while visually analyzing their spending patterns using interactive charts.

---

## 🚀 Features

### 🔐 Authentication System

* User registration and login with secure JWT authentication
* Password hashing using bcrypt
* Session management using localStorage

### 💸 Expense Management

* Add, view, and delete expenses
* Categorize transactions
* Track "Spent" and "Pending" expenses separately
* Real-time updates on dashboard

### 📊 Dashboard & Visualization

* Interactive charts using Chart.js
* Dynamic expense summaries
* Clean and responsive UI

---

## 🛠️ Technology Stack

### 🎨 Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* Chart.js

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* PostgreSQL (Supabase)

### ☁️ Deployment

* Vercel (Frontend)
* Render (Backend)

---

## ⚙️ Installation

### 🔧 Prerequisites

* Node.js (v18+)
* PostgreSQL / Supabase account
* Git

---

### 🚀 Steps

```bash
# Clone the repository
git clone https://github.com/Pooja0629/Expense-Tracker.git

# Navigate to backend
cd Expense-Tracker/server

# Install dependencies
npm install

# Run server
node server.js
```

Create a `.env` file inside `/server`:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Open in browser:

```
public/login.html
```

---

## 📖 Usage

### 👤 Authentication

1. Register with email and password
2. Login securely
3. Session maintained using token

### 💰 Expense Tracking

1. Add new expenses with amount and description
2. View expenses in dashboard
3. Delete unwanted entries
4. Monitor pending vs completed expenses

---

## 📡 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| POST   | /api/signup | Register user |
| POST   | /api/login  | Login user    |

---

### 💸 Expense Endpoints

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | /api/expenses     | Get all expenses |
| POST   | /api/expenses     | Add expense      |
| DELETE | /api/expenses/:id | Delete expense   |

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    description VARCHAR(255),
    amount DECIMAL(10, 2),
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Spent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📁 Project Structure

```
expense-tracker/
│
├── public/        # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── script.js
│   ├── style.css
│
├── server/        # Backend files
│   ├── server.js
│   ├── package.json
│
├── README.md
├── LICENSE
```

---

## 🌐 Deployment

### 🔗 Live Demo

* Frontend (Vercel): https://expense-tracker-two-vert.vercel.app

---

## 🚀 Future Improvements

* Category-wise analytics
* Monthly expense reports
* Mobile UI enhancements
* User profile management

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Contact

**Pooja S**

AI & Data Science Student

📧 Email: [poojashree2266@gmail.com](mailto:poojashree2266@gmail.com)

🔗 GitHub: https://github.com/Pooja0629

---

✨ *“Simplifying financial tracking through smart and intuitive web solutions.”*
