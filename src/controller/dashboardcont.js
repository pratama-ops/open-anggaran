const dashboardMod = require('../model/dashboardmod');
const analisisMod = require('../model/analisis');

const dashboardCont = {
    //ambil semua data yg dibutuhkan lalu kirim ke view
    index: async (req, res) => {
        try {
            //agar data tidak ditampilkan di 1 halaman sekaligus
            const page = parseInt(req.query.page) || 1;
            //ambil data hanya 20 baris per halaman
            const limit = 20
            //jumlah data yg ditampilkan per halaman
            const offset = (page - 1) * limit;

            const pengadaan = await dashboardMod.getAll({ limit, offset });
            const totalData = await dashboardMod.getCount();
            const totalPagu = await dashboardMod.getTotalPagu();
            //untuk tau berapa total halaman yg ada
            const totalHalaman = Math.ceil(totalData / limit);

            res.render('dashboard', {
                pengadaan,
                totalData,
                totalPagu,
                totalHalaman,
                //dikirim ke ejs agar tau user sekarang ada di halaman brp
                halamanSaat: page,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Terjadi kesalahan server');
        }
    },

    rekap: async (req, res) => {
        try {
            const result = await analisisMod.getRekap()
            res.render('rekap', { result });
        } catch (err) {
            console.error(err);
            res.status(500).send('Terjadi kesalahan server!');
        }
    },
};

module.exports = dashboardCont;