const { Transactions,TransactionItems } = require("../models")

const db = require('../models');
const sequelize = db.sequelize;

function defineAPIOrderEndpoints(app) {
    app.get("/order_list", async (req, res) => {
        console.log("GET /order request received");

        try {
            const [results, metadata] = await sequelize.query(
                'select * from TransactionDetails'
            );

            const transactions = new Map();
            console.log(results)
            results.forEach(row => {
                if (!transactions.has(row.TransactionID)) {
                    transactions.set(row.TransactionID, {
                        TransactionID: row.TransactionID,
                        TransactionName: row.TransactionName,
                        TransactionDate: row.TransactionDate,
                        Items: []
                    });
                }

                if (row.TransactionItemID) {
                    const item = {
                        TransactionItemID: row.TransactionItemID,
                        ProductID: row.ProductID,
                        ProductName: row.ProductName,
                        Quantity: row.Quantity,
                        Price: row.Price,
                        Paid: row.Paid,
                        Allergens: row.AllergenName ? [row.AllergenName] : []
                    };

                    const existingItem = transactions.get(row.TransactionID).Items.find(i => i.TransactionItemID === row.TransactionItemID);
                    if (existingItem) {
                        if (row.AllergenName) existingItem.Allergens.push(row.AllergenName);
                    } else {
                        transactions.get(row.TransactionID).Items.push(item);
                    }
                }
            });

            res.json([...transactions.values()]);
        } catch (err) {
            console.error("Error retrieving orders:", err);
            res.status(500).send("Error retrieving orders");
        }
    });


    app.post('/order-add', async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Missing order name" });
        }

        try {
            await Transactions.create({ Name: name });
            res.status(201).json({ message: "Order added successfully" });
        } catch (err) {
            console.error("Error adding order:", err);
            res.status(500).json({ error: "Error adding order" });
        }
    });


    app.post('/order-save/:id', async (req, res) => {
        const orderId = req.params.id;
        const items = req.body;

        try {
            await Promise.all(items.map(async (item) => {
                const newItem = await TransactionItems.create({
                    TransactionID: orderId,
                    ProductID: item.productId,
                    Quantity: item.quantity,
                    Price: item.price
                });

                if (item.allergens && item.allergens.length > 0) {
                    await newItem.setAllergens(item.allergens);
                }
            }));

            res.status(200).json({ message: "Order adding successfully" });
        } catch (err) {
            console.error("Error adding order:", err);
            res.status(500).json({ error: "Error adding order" });
        }
    });
}

module.exports = { defineAPIOrderEndpoints };
