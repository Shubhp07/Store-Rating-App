const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getDashboard } = require('../controllers/storeOwnerController');

router.use(authenticate, authorizeRoles('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;