const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUsers } = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.get('/me', auth, getMe);
router.get('/users', auth, roleCheck(['Admin']), getUsers);

module.exports = router;
