const { pool } = require('../../config/db');

const pengadaanMod = {
    getById: async(id) => {
        const result = await pool.query(`SELECT * FROM pengadaan WHERE id = $1`, [id]);

        return result.rows[0]; //result.rows[0] kalau hasilnya adalah satu objek, kalau array pakai return.rows
    },
};

module.exports = pengadaanMod;