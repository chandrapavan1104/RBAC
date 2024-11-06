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
    let params = [`%${searchQuery}%`, limit, offset];

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
const setPermission = async (req, res) => {
    //console.log(req.body);
    const { level, levelId, canRead, canWrite, canEdit, canDelete, inheritance } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO permissions (level, level_id, can_read, can_write, can_edit, can_delete, inheritance)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [level, levelId, canRead, canWrite, canEdit, canDelete, inheritance]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error setting permission:', error);
        res.status(500).json({ error: 'Error setting permission' });
    }
};

// 4. Update an existing permission
const updatePermission = async (req, res) => {
    const { id } = req.params;
    const { canRead, canWrite, canEdit, canDelete, inheritance } = req.body;

    try {
        const result = await db.query(
            `UPDATE permissions
             SET can_read = $1, can_write = $2, can_edit = $3, can_delete = $4, inheritance = $5
             WHERE id = $6
             RETURNING *`,
            [canRead, canWrite, canEdit, canDelete, inheritance, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'Error updating permission' });
    }
};

// 5. Delete a permission by ID
const deletePermission = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`DELETE FROM permissions WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'Error deleting permission' });
    }
};

// 6. Fetch all permissions with role details
const getAllPermissions = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM permissions;
        `);
        //console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Error fetching permissions' });
    }
};

const checkDuplicatePermission = async (req, res) => {
    const { level, levelId, canRead, canWrite, canEdit, canDelete } = req.body;

    try {
        // Query the permissions table to check for a similar permission
        const result = await db.query(
            `SELECT * 
            FROM permissions
            WHERE LOWER(level) = LOWER($1) 
              AND level_id = $2 
              AND can_read = $3 
              AND can_write = $4 
              AND can_edit = $5 
              AND can_delete = $6;
            `,
            [level, levelId, canRead, canWrite, canEdit, canDelete]
        );

        if (result.rows.length > 0) {
            // Similar permission exists, return the existing item
            return res.json({ exists: true, permissions: result.rows[0] });
        } else {
            // Step 1: Insert the new permission 
            const permissionResult = await db.query(
                `INSERT INTO permissions (level, level_id, can_read, can_write, can_edit, can_delete)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [level, levelId, canRead, canWrite, canEdit, canDelete]
            );

            // Return the new role and permission information
            res.status(201).json({ exists: false, permission: permissionResult.rows[0] });
        }
    } catch (error) {
        console.error('Error checking duplicate permission:', error);
        res.status(500).json({ error: 'Error checking duplicate permission' });
    }
};


module.exports = {
    getItemsInLevel,
    setPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,
    checkDuplicatePermission
};
