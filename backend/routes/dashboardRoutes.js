const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

router.get('/summary', auth, roleCheck(['Viewer', 'Analyst', 'Admin']), getDashboardSummary);

module.exports = router;
