const {Product} = require("../models");

function defineAPIAllergenEndpoints(app) {
    app.get('/allergens_list',(req, res) =>{
        Product.findAll().then((products) => {
            res.send(products)
        }).catch((err) => {
            console.log(err)
            res.status(500).send("Error retrieving allergens");
        })
    });
}
module.exports = { defineAPIAllergenEndpoints }