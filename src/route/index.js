const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardcont');
const pengadaanCont = require('../controller/pengadaancont');

router.get('/', dashboardController.index);

router.get('/pengadaan/:id', pengadaanCont.detail);

module.exports = router;