const express = require('express');
const pool = require('../db');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.addUser);
router.get('/', userController.getAllUsers);
router.post('/assign-role', userController.assignRoleToUser);
router.delete('/remove-role', userController.removeRoleFromUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
