const express = require('express');
const router = express.Router();

const { 
    addUser, 
    getAllUsers, 
    assignRoleToUser, 
    removeRoleFromUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');

router.post('/', addUser);
router.get('/', getAllUsers);
router.post('/assign-role', assignRoleToUser);
router.delete('/remove-role', removeRoleFromUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
