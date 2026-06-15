const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores
} = require('../controllers/adminController');

// All admin routes require login + admin role
router.use(authenticate, authorizeRoles('admin'));

router.get('/dashboard',   getDashboard);
router.post('/users',      addUser);
router.get('/users',       getUsers);
router.get('/users/:id',   getUserById);
router.post('/stores',     addStore);
router.get('/stores',      getStores);

module.exports = router;