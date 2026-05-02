const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardcont');
const pengadaanCont = require('../controller/pengadaancont');
const agentCont = require('../controller/agentcont');

router.get('/', dashboardController.index);

router.get('/pengadaan/:id', pengadaanCont.detail);

router.post('/analisis/:id', agentCont.analyze);

module.exports = router;