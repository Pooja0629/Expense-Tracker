const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serving the frontend files
app.use(express.static('../public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres.imnwlyvwdfoldlkwgbmn:FxcFVMVLauvUASkT@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET || 'ExpenseTracker', (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

// AUTH ROUTES
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Signup error" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'ExpenseTracker', { expiresIn: '24h' });
            res.json({ token, email: user.email });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// EXPENSE ROUTES
app.get('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Fetch error" });
    }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
    try {
        const { description, amount, category, status } = req.body;
        const result = await pool.query(
            'INSERT INTO expenses (user_id, description, amount, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, description, amount, category, status || 'Spent']
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Add error" });
    }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Use 'pool.query' to match the rest of your server code
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ error: "Database error during deletion" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));