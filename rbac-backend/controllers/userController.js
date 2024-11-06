const db = require('../db'); // Assume db is the configured database connection

// Get all users with their roles
const getAllUsers = async (req, res) => {
  try {
    const usersResult = await db.query(
    `SELECT * FROM users;`
    );
    res.json(usersResult.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
}

// Add a new user
const addUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = await db.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *', [username, email]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
}

// Assign a role to a user
const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning role', error });
  }
}

// Remove a role from a user
const removeRoleFromUser = async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    await db.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
    res.status(200).json({ message: 'Role removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing role', error });
  }
}

// Update a user by ID
const updateUser = async (req, res) => {
    const { username, email } = req.body;
    try {
        const result = await db.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
            [username, email, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllUsers,
    addUser,
    assignRoleToUser,
    updateUser,
    removeRoleFromUser,
    deleteUser
};