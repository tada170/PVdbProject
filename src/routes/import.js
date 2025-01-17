const { Transactions, Category } = require("../models");

function defineAPIImportEndpoints(app) {
    app.post('/import-Tdata', async (req, res) => {
        console.log('Přijatá data:', req.body);

        const transactions = req.body.transactions;

        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ error: "No transactions provided" });
        }

        try {
            const createdTransactions = await Transactions.bulkCreate(transactions);

            res.status(201).json({
                message: "Transactions added successfully",
                transactions: createdTransactions
            });
        } catch (err) {
            console.error("Error adding transactions:", err);
            res.status(500).json({ error: "Error adding transactions" });
        }
    });

    app.post('/import-Cdata', async (req, res) => {
        console.log('Přijatá data:', req.body);

        const category = req.body.category;

        if (!Array.isArray(category) || category.length === 0) {
            return res.status(400).json({ error: "No category provided" });
        }

        try {
            const createdCategory = await Category.bulkCreate(category);

            res.status(201).json({
                message: "Category added successfully",
                category: createdCategory
            });
        } catch (err) {
            console.error("Error adding category:", err);
            res.status(500).json({ error: "Error adding category" });
        }
    });
}

module.exports = { defineAPIImportEndpoints };
