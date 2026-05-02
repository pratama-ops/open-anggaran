const agent = require('../agent');

const agentCont = {
    analyze: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await agent.analyze(id);

            res.json({ success: true, data: result });
        } catch (err) {
            console.error(err);
            res.json({ success: false, message: err.message });
        }
    },
};

module.exports = agentCont;