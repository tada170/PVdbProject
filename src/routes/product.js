const { Product } = require("../models");
const { ProductAllergen } = require("../models")
function defineAPIProductEndpoints(app) {
    app.post("/products", async (req, res) => {
        const { Name, Price, CategoryID, Allergens } = req.body;

        try {
            const newProduct = await Product.create({
                Name: Name,
                Price: Price,
                CategoryID: CategoryID,
            });

            if (Allergens.length > 0) {
                const allergenData = Allergens.map((allergenID) => ({
                    ProductID: newProduct.ProductID,
                    AllergenID: allergenID,
                }));
                await ProductAllergen.bulkCreate(allergenData);
            }

            res.status(201).json({ message: "Product created successfully" });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).send("Error creating product");
        }
    });

    app.get("/product-list", async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [{ model: ProductAllergen, as: 'allergens' }],
            });
            res.json(products);
        } catch (error) {
            console.error("Error retrieving products:", error);
            res.status(500).send("Error retrieving products");
        }
    });

    app.get("/product/:id", async (req, res) => {
        const { categoryId } = req.params.id;
        try {
            const products = await Product.findAll({
                where: { KategorieID: categoryId },
                include: [ProductAllergen],
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
        const { id } = req.params.id;

        try {
            await ProductAllergen.destroy({ where: { ProductID: id } });
            const deleted = await Product.destroy({ where: { ProductID: id } });

            if (!deleted) {
                return res.status(404).send("Product not found");
            }

            res.sendStatus(204);
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).send("Error deleting product");
        }
    });

    app.put("/products/:id", async (req, res) => {
        const { id } = req.params.id;
        const { Name, Price, Allergens } = req.body;

        try {
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).send("Product not found");
            }

            await product.update({ Name: Name, Price: Price });

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
