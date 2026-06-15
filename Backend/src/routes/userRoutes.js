const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getStores, submitRating, updateRating } = require('../controllers/userController');

router.use(authenticate, authorizeRoles('user'));

router.get('/stores',        getStores);
router.post('/ratings',      submitRating);
router.patch('/ratings/:id', updateRating);

module.exports = router;