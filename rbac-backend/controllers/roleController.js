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
    try {
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
      res.status(200).json({ message: 'Role assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning role', error });
    }
}

// Create a new role with permissions
const createRoleWithPermissions = async (req, res) => {
    const { name, description, permissions } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        const newRole = result.rows[0];

        if (permissions && permissions.length > 0) {
            await Promise.all(
                permissions.map(permissionId =>
                    db.query(
                        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
                        [newRole.id, permissionId]
                    )
                )
            );
        }

        res.status(201).json(newRole);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing role with permissions
const updateRoleWithPermissions = async (req, res) => {
    const { name, description, permissions } = req.body;
    const { id } = req.params;
    try {
        const result = await db.query(
            'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );

        const updatedRole = result.rows[0];
        if (!updatedRole) return res.status(404).json({ error: 'Role not found' });

        // Delete existing permissions and reassign them
        await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

        if (permissions && permissions.length > 0) {
            await Promise.all(
                permissions.map(permissionId =>
                    db.query(
                        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
                        [id, permissionId]
                    )
                )
            );
        }

        res.json(updatedRole);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignRoleToUser,
    createRoleWithPermissions,
    updateRoleWithPermissions
};

  