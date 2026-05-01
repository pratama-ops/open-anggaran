const pengadaanMod = require('../model/pengadaan');
const analisisMod = require('../models/analisis');

const pengadaanCont = {
    detail: async(req, res) => {
        try {
            const { id } = req.param;

            const pengadaan = await pengadaanMod.getById(id);
            const analisis = await analisisMod.getById(id);

            if(!pengadaan) return res.status(400).send('Paket tidak ditemukan!!');

            res.render('detail', { pengadaan, analisis });
        } catch (err) {
            console.error(err);
            res.status(500).send('Terjadi kesalahan pada server!!');
        }
    },
};

module.exports = pengadaanCont;