const { Product } = require("../models");
const { Allergen } = require("../models")
const { ProductAllergen } = require("../models")
const {TransactionItems} = require("../models")

const db = require('../models');
const sequelize = db.sequelize;

function defineAPIProductEndpoints(app) {
    app.post("/product_add", async (req, res) => {
        const { Name, Price, CategoryID, Allergens = [] } = req.body;

        const transaction = await sequelize.transaction();

        try {
            const newProduct = await Product.create(
                { Name, Price, CategoryID },
                { transaction }
            );

            if (Allergens.length > 0) {
                const allergenData = Allergens.map((allergenID) => ({
                    ProductID: newProduct.ProductID,
                    AllergenID: allergenID,
                }));
                await ProductAllergen.bulkCreate(allergenData, { transaction });
            }else{
                await ProductAllergen.create({
                    ProductID: newProduct.ProductID,
                    AllergenID: 59,
                }, { transaction });
            }

            await transaction.commit();
            res.status(201).json({ message: "Product created successfully" });
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating product:", error);
            res.status(500).send("Error creating product");
        }
    });

    app.get("/product-list", async (req, res) => {
        try {
            const productAllergens = await ProductAllergen.findAll({
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['Name', 'Price'],
                    },
                    {
                        model: Allergen,
                        as: 'allergen',
                        attributes: ['Name'],
                    }
                ]
            });

            res.json(productAllergens);
        } catch (error) {
            console.error("Error retrieving products:", error);
            res.status(500).send("Error retrieving products");
        }
    });

    app.get("/products/:id", async (req, res) => {
        const categoryId = req.params.id;
        try {
            const products = await Product.findAll({
                where: { CategoryID: categoryId },
                include: [
                    {
                        model: ProductAllergen,
                        as: 'allergens'
                    },
                ],
            });

            if (products.length === 0) {
                return res.status(404).send("No products found for this category");
            }

            res.json(products);
        } catch (error) {
            console.error("Error retrieving products by category:", error);
            res.status(500).send("Error retrieving products");
        }
    });

    app.delete("/product/:id", async (req, res) => {
        const id = req.params.id;
        const transaction = await sequelize.transaction();

        try {
            await ProductAllergen.destroy({ where: { ProductID: id }, transaction });

            const deleted = await Product.destroy({ where: { ProductID: id }, transaction });

            if (!deleted) {
                return res.status(404).send("Product not found");
            }

            await transaction.commit();

            res.sendStatus(204);
        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting product:", error);
            res.status(500).send("Error deleting product");
        }
    });

    app.put("/product/:id", async (req, res) => {
        const id  = req.params.id;
        const { Name, Price, Allergens } = req.body;

        try {
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).send("Product not found");
            }

            await product.update({ Name: Name, Price: Price });
            await TransactionItems.update(
                { Price: Price },
                { where: { ProductID: id } }
            );

            await ProductAllergen.destroy({ where: { ProductID: id } });

            if (Allergens.length > 0) {
                const allergenData = Allergens.map((allergenID) => ({
                    ProductID: id,
                    AllergenID: allergenID,
                }));
                await ProductAllergen.bulkCreate(allergenData);
            }
            res.status(200).json({ message: "Product updated successfully" });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).send("Error updating product");
        }
    });
}

module.exports = { defineAPIProductEndpoints };
