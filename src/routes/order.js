const { Transactions,TransactionDetail } = require("../models")
function defineAPIOrderEndpoints(app) {
    app.get("/order_list", async (req, res) => {
        console.log("GET /order request received");

        try {
            const transactions = await TransactionDetail.findAll();

            const result = transactions.map(transaction => {
                return {
                    TransactionID: transaction.TransactionID,
                    TransactionName: transaction.TransactionName,
                    TransactionDate: transaction.TransactionDate,
                    TransactionItemID: transaction.TransactionItemID,
                    ProductID: transaction.ProductID,
                    ProductName: transaction.ProductName,
                    Quantity: transaction.Quantity,
                    Price: transaction.Price,
                    Paid: transaction.Paid,
                    AllergenName: transaction.AllergenName,
                };
            });
            res.status(201).json({ message: "Transaction created successfully" });
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


    // app.post('/order-save/:id', async (req, res) => {
    //     const orderId = req.params.id;
    //     const items = req.body;
    //
    //     try {
    //         await Promise.all(items.map(async (item) => {
    //             const newItem = await TransactionItem.create({
    //                 TransactionID: orderId,
    //                 ProductID: item.productId,
    //                 quantity: item.quantity,
    //                 Price: item.price
    //             });
    //
    //             if (item.allergens && item.allergens.length > 0) {
    //                 await newItem.setAllergens(item.allergens);
    //             }
    //         }));
    //
    //         res.status(200).json({ message: "Order updated successfully" });
    //     } catch (err) {
    //         console.error("Error updating order:", err);
    //         res.status(500).json({ error: "Error updating order" });
    //     }
    // });
}

module.exports = { defineAPIOrderEndpoints };
