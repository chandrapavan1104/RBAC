const db = require('../db'); // Assume db is the configured database connection

// 1. Get items for a specific level (e.g., App, Module, Feature)
const getItemsInLevel = async (req, res) => {
    const { level } = req.params;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.search || '';
    const limit = 10; // Define the number of items per page
    const offset = (page - 1) * limit;

    let query = '';
    let countQuery = '';
    const params = [`%${searchQuery}%`, limit, offset];

    switch (level.toLowerCase()) {
        case 'app':
            query = `SELECT id, name FROM apps WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM apps WHERE name ILIKE $1`;
            break;
        case 'module':
            query = `SELECT id, name FROM modules WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM modules WHERE name ILIKE $1`;
            break;
        case 'feature':
            query = `SELECT id, name FROM features WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM features WHERE name ILIKE $1`;
            break;
        case 'object':
            query = `SELECT id, name FROM objects WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM objects WHERE name ILIKE $1`;
            break;
        case 'record':
            query = `SELECT id, name FROM records WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM records WHERE name ILIKE $1`;
            break;
        case 'field':
            query = `SELECT id, name FROM fields WHERE name ILIKE $1 LIMIT $2 OFFSET $3`;
            countQuery = `SELECT COUNT(*) FROM fields WHERE name ILIKE $1`;
            break;
        default:
            return res.status(400).json({ error: 'Invalid level specified' });
    }

    try {
        const itemsResult = await db.query(query, params);
        const countResult = await db.query(countQuery, [params[0]]);
        const totalItems = parseInt(countResult.rows[0].count, 10);

        res.json({
            items: itemsResult.rows,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Error fetching items for the specified level' });
    }
};

// 2. Set a new permission for a role at a specified level
const createPermission = async (req, res) => {
    const { level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description } = req.body;
    try {
        const permission = await setPermission(level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description);
        res.status(201).json(permission);
    } catch (error) {
        console.error('Error setting permission:', error);
        res.status(500).json({ error: 'Error setting permission' });
    }
};

// 3. Update an existing permission
const updatePermission = async (req, res) => {
    const { id } = req.params;
    const { level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description } = req.body;

    try {
        const findPermission = await db.query(`SELECT * FROM permissions WHERE id = $1`, [id]);

        if (findPermission.rows.length === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        const duplicatePermission = await checkDuplicate(level, levelId, canRead, canWrite, canEdit, canDelete, inheritance);
        if (duplicatePermission && duplicatePermission.id !== parseInt(id)) {
            return res.status(409).json({ error: 'Duplicate permission exists' });
        }

        const result = await db.query(
            `UPDATE permissions
             SET level = $1, level_id = $2, can_read = $3, can_write = $4, can_edit = $5, can_delete = $6, inheritance = $7, name = $8, description = $9
             WHERE id = $10
             RETURNING *`,
            [level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'Error updating permission' });
    }
};

// 4. Delete a permission by ID
const deletePermission = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`DELETE FROM permissions WHERE id = $1 RETURNING *`, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'Error deleting permission' });
    }
};

// 5. Fetch all permissions with role details
const getAllPermissions = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM permissions`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Error fetching permissions' });
    }
};

// Helper function to check for duplicate permission
const checkDuplicate = async (level, levelId, canRead, canWrite, canEdit, canDelete, inheritance) => {
    const result = await db.query(
        `SELECT * 
         FROM permissions
         WHERE LOWER(level) = LOWER($1) 
           AND level_id = $2 
           AND can_read = $3 
           AND can_write = $4 
           AND can_edit = $5 
           AND can_delete = $6
           AND inheritance = $7`,
        [level, levelId, canRead, canWrite, canEdit, canDelete, inheritance]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Helper function to set a new permission
const setPermission = async (level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description) => {
    const result = await db.query(
        `INSERT INTO permissions (level, level_id, can_read, can_write, can_edit, can_delete, inheritance, name, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description]
    );
    return result.rows[0];
};

// Main function to handle duplicate check and setting permission
const checkDuplicateAndSetPermission = async (req, res) => {
    const { level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description } = req.body;

    try {
        const duplicatePermission = await checkDuplicate(level, levelId, canRead, canWrite, canEdit, canDelete, inheritance);
        
        if (duplicatePermission) {
            return res.json({ exists: true, permission: duplicatePermission });
        } 
        
        const newPermission = await setPermission(level, levelId, canRead, canWrite, canEdit, canDelete, inheritance, name, description);
        
        res.status(201).json({ exists: false, permission: newPermission });

    } catch (error) {
        console.error('Error checking or setting permission:', error);
        res.status(500).json({ error: 'Error checking or setting permission' });
    }
};

module.exports = {
    getItemsInLevel,
    createPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,
    checkDuplicateAndSetPermission
};
