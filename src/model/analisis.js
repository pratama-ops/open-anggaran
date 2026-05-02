const { pool } = require('../../config/db');

const analisisMod = {
    getByPengadaanId: async (id) => {
        const result = await pool.query(`SELECT * FROM analisis WHERE pengadaan_id = $1`, [id]);

        return result.rows[0];
    },
};

module.exports = analisisMod;