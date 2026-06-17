const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addStore,
  getStores,
  updateStore,
  deleteStore
} = require('../controllers/adminController');

// All admin routes require login + admin role
router.use(authenticate, authorizeRoles('admin'));

router.get('/dashboard',   getDashboard);
router.post('/users',      addUser);
router.get('/users',       getUsers);
router.get('/users/:id',   getUserById);
router.put('/users/:id',     updateUser);
router.delete('/users/:id',  deleteUser);
router.post('/stores',     addStore);
router.get('/stores',      getStores);
router.put('/stores/:id',    updateStore);
router.delete('/stores/:id', deleteStore);

module.exports = router;