const db = require('../db'); // Import database connection
const pool = db.pool; // Adjust based on your actual db connection

// Create a new role
exports.createRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a role by ID
exports.updateRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a role by ID
exports.deleteRole = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json({ message: 'Role deleted successfully', role: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

  