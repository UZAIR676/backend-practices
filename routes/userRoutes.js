const express = require('express');

const router = express.Router();

const {registerController,getAllUsers,loginController,deleteUser} = require('../controllers/userController.js')

router.get('/all-users', getAllUsers);

router.post('/register', registerController);

router.post('/login', loginController);

router.delete('/delete', deleteUser);

module.exports = router;
