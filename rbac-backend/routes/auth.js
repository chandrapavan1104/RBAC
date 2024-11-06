const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userQuery = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        const user = userQuery.rows[0];
        
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(403).send('Invalid credentials');
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
