const { pool } = require('../../config/db');

const analisisMod = {
    getByPengadaanId: async (id) => {
        const result = await pool.query(`SELECT * FROM analisis WHERE pengadaan_id = $1`, [id]);

        return result.rows[0];
    },

    getRekap: async () => {
        const result = await pool.query(
            `SELECT a.id, a.status, a.insight, a.analyzed_at,
            p.nama_paket, p.pagu_rp, p.klpd, p.lokasi, p.id as pengadaan_id
     FROM analisis a
     JOIN pengadaan p ON a.pengadaan_id = p.id
     ORDER BY a.analyzed_at DESC`
        );

        return result.rows;
    }
};

module.exports = analisisMod;