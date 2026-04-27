const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardcont');

router.get('/', dashboardController.index);

module.exports = router;