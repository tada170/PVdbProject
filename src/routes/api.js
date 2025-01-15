const {defineAPIAllergenEndpoints} = require("./alergen");
const {defineAPICategoriesEndpoints} = require("./category");
const {defineAPIProductEndpoints} = require("./product");
const {defineAPIOrderEndpoints} = require("./order");

function defineAPIEndpoints(app){
    defineAPIAllergenEndpoints(app);
    defineAPICategoriesEndpoints(app);
    defineAPIProductEndpoints(app);
    defineAPIOrderEndpoints(app);
}
module.exports = {defineAPIEndpoints};