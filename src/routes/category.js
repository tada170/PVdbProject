const {Category} = require("../models");

function defineAPICategoriesEndpoints(app) {
    app.get('/category_list',async (req, res) =>{
        Category.findAll().then((category) => {
            res.send(category)
        }).catch((err) => {
            console.log(err)
            res.status(500).send("Error retrieving allergens");
        })
    });
    app.post('/category_add', async (req, res) => {
        Category.create({
            Name: req.body.Name
        }).then(() => {
            res.status(201).json({ message: "Category added successfully" });
        }).catch((err) => {
            console.log(err)
            res.status(500).send("Error creating category");
        })
    });
    app.delete('/category_delete/:id',async (req,res) => {
        Category.destroy({
            where: {CategoryID: req.params.id}
        }).then(() =>{
            res.status(200).json({ message: "Category deleted successfully" });
        }).catch(err => {
            res.status(500).json({ message: "Error deleting category" });
        })
    });
    app.put('/category_update/:id', async (req, res) => {
        Category.update(
            {Name: req.body.Name},
            {where: {CategoryID: req.params.id}}
        ).then(() => {
            res.status(200).json({ message: "Category updated successfully" });
        }).catch(err => {
            res.status(500).json({ message: "Error updating category" });
        })
    })
}
module.exports = { defineAPICategoriesEndpoints }