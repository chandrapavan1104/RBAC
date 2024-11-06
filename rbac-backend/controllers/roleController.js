const db = require('../db'); // Import database connection


// Create a new role
const createRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM roles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single role by ID
const getRoleById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM roles WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a role by ID
const updateRole = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await db.query(
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
const deleteRole = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM roles WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json({ message: 'Role deleted successfully', role: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const assignRoleToUser = async (req, res) => {
    const { userId, roleId } = req.body;
    console.log(req.body);
    try {
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
      res.status(200).json({ message: 'Role assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning role', error });
    }
}

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignRoleToUser
};

  