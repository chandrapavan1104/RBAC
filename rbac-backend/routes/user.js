const express = require('express');
const router = express.Router();

const { 
    addUser, 
    getAllUsers, 
    assignRoleToUser, 
    removeRoleFromUser, 
    updateUser, 
    deleteUser,
    getUserRoles 
} = require('../controllers/userController');

router.post('/', addUser);
router.get('/', getAllUsers);
router.post('/assign-role', assignRoleToUser);
router.post('/remove-role', removeRoleFromUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/roles', getUserRoles);

module.exports = router;
