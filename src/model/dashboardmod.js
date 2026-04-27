const pool = require('../../config/db');

const dashboardMod = {
    //ambil semua data dengan pagination
    getAll: async ({ limit = 20, offset = 0 }) => {
        const result = await pool.query(`SELECT * FROM pengadaan ORDER BY imported_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]);
      return result.rows;
    },

    //ambil total jumlah data untuk pagination & statistik
    getCount: async () => {
        const result = await pool.query(`SELECT COUNT(*) FROM pengadaan`);
        return parseInt(result.rows[0].count); //pakai parseint karena ada query 'count'
    },

    //ambil total nilai pagu seluruhnya
    getTotalPagu: async () => {
        const result = await pool.query(`SELECT SUM(pagu_rp) FROM pengadaan`);
        return parseInt(result.rows[0].count); //pakai parseint karena ada query 'sum'
    },
};

module.exports = dashboardMod;