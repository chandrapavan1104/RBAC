const express = require('express');
const router = express.Router();
const {
    getAllRoles, 
    deleteRole,
    assignRoleToUser,
    createRoleWithPermissions,
    updateRoleWithPermissions 
} = require('../controllers/roleController');


router.get('/', getAllRoles);
router.delete('/:id', deleteRole);
router.post('/assign-role', assignRoleToUser);
router.post('/', createRoleWithPermissions);
router.put('/:id', updateRoleWithPermissions);

module.exports = router;
