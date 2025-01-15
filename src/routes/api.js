const {defineAPIAllergenEndpoints} = require("./alergen");
const {defineAPICategoriesEndpoints} = require("./category");
const {defineAPIProductEndpoints} = require("./product");

function defineAPIEndpoints(app){
    defineAPIAllergenEndpoints(app);
    defineAPICategoriesEndpoints(app);
    defineAPIProductEndpoints(app);
}
module.exports = {defineAPIEndpoints};