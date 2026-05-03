const express = require('express');
const router = express.Router();
const dashboardCont = require('../controller/dashboardcont');
const pengadaanCont = require('../controller/pengadaancont');
const agentCont = require('../controller/agentcont');

router.get('/', dashboardCont.index);

router.get('/pengadaan/:id', pengadaanCont.detail);

router.get('/rekapitulasi', dashboardCont.rekap);

router.post('/analisis/:id', agentCont.analyze);

module.exports = router;