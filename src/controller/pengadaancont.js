const pengadaanMod = require('../model/pengadaan');
const analisisMod = require('../model/analisis');

const pengadaanCont = {
    detail: async(req, res) => {
        try {
            const { id } = req.params;

            const pengadaan = await pengadaanMod.getById(id);
            const analisis = await analisisMod.getByPengadaanId(id);

            if(!pengadaan) return res.status(400).send('Paket tidak ditemukan!!');

            res.render('detail', { pengadaan, analisis });
        } catch (err) {
            console.error(err);
            res.status(500).send('Terjadi kesalahan pada server!!');
        }
    },
};

module.exports = pengadaanCont;