const express = require('express');
const router = express.Router();
const {
    createRole, 
    getAllRoles, 
    getRoleById, 
    updateRole, 
    deleteRole,
    assignRoleToUser 
} = require('../controllers/roleController');

// Create a new role
router.post('/', createRole);

// Get all roles
router.get('/', getAllRoles);

// Get a single role by ID
router.get('/:id', getRoleById);

// Update a role by ID
router.put('/:id', updateRole);

// Delete a role by ID
router.delete('/:id', deleteRole);

router.post('/assign-role', assignRoleToUser);
module.exports = router;
