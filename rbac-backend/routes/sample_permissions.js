const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create a new permission
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO sample_permissions (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating permission:', err);
        res.status(500).json({ error: 'Failed to create permission' });
    }
});

// Get all permissions
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sample_permissions');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching permissions:', err);
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
});

// Get a single permission by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sample_permissions WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching permission:', err);
        res.status(500).json({ error: 'Failed to fetch permission' });
    }
});

// Update a permission by ID
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE sample_permissions SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating permission:', err);
        res.status(500).json({ error: 'Failed to update permission' });
    }
});

// Delete a permission by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM sample_permissions WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }
        res.json({ message: 'Permission deleted successfully', permission: result.rows[0] });
    } catch (err) {
        console.error('Error deleting permission:', err);
        res.status(500).json({ error: 'Failed to delete permission' });
    }
});

module.exports = router;
