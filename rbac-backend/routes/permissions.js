const express = require('express');
const router = express.Router();
const {
    getItemsInLevel,
    setPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,      // Add this line
    checkDuplicatePermission,
} = require('../controllers/permissionsController');

// Fetch all permissions
router.get('/all', getAllPermissions);

// Other routes
router.get('/level/:level', getItemsInLevel);
router.post('/', setPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);
router.post('/check-duplicate', checkDuplicatePermission);

module.exports = router;
