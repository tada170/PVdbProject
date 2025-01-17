const {defineAPIAllergenEndpoints} = require("./alergen");
const {defineAPICategoriesEndpoints} = require("./category");
const {defineAPIProductEndpoints} = require("./product");
const {defineAPIOrderEndpoints} = require("./order");
const {defineAPIReportEndpoints} = require("./report");

function defineAPIEndpoints(app){
    defineAPIAllergenEndpoints(app);
    defineAPICategoriesEndpoints(app);
    defineAPIProductEndpoints(app);
    defineAPIOrderEndpoints(app);
    defineAPIReportEndpoints(app)
}
module.exports = {defineAPIEndpoints};