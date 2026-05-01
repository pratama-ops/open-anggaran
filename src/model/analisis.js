const pool = require('../../config/db');

const analisisMod = {
    getById: async (id) => {
        const result = await pool.query(`SELECT * FROM pengadaan WHERE id = $1`, [id]);

        return result.rows[0];
    },
};

module.exports = analisisMod;