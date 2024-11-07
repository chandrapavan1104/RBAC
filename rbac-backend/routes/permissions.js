const express = require('express');
const router = express.Router();
const {
    getItemsInLevel,
    createPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,      // Add this line
    checkDuplicateAndSetPermission,
} = require('../controllers/permissionsController');

// Fetch all permissions
router.get('/all', getAllPermissions);

// Other routes
router.get('/level/:level', getItemsInLevel);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);
router.post('/check-duplicate', checkDuplicateAndSetPermission);

module.exports = router;
