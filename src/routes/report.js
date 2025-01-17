

const db = require('../models');
const sequelize = db.sequelize;

function defineAPIReportEndpoints(app) {
    app.get("/reports", async (req, res) => {

        try {
            const [results, metadata] = await sequelize.query(
                'select * from report'
            );
            res.json(results);
        } catch (err) {
            console.error("Error retrieving orders:", err);
            res.status(500).send("Error retrieving orders");
        }
    });
}

module.exports = { defineAPIReportEndpoints };
