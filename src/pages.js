const path = require("path");
const projectPath = path.join(__dirname, "..");

function defineHTMLEndpoints(app){
    app.get('/', (req, res) => {
        res.sendFile(projectPath +'/html' + '/index.html');
    });

    app.get('/category-add', (req, res) => {
        res.sendFile(projectPath + '/html' + '/category_add.html');
    });

    app.get('/category-list', (req, res) => {
        res.sendFile(projectPath + '/html' + '/category_list.html');
    });

    app.get('/product-add', (req, res) => {
        res.sendFile(projectPath + '/html' + '/product_add.html');
    });

    app.get('/products-list', (req, res) => {
        res.sendFile(projectPath + '/html' + '/product_list.html');
    });

    app.get('/order-add', (req, res) => {
        res.sendFile(projectPath + '/html' + '/order_add.html');
    });
    app.get('/report', (req, res) => {
        res.sendFile(projectPath + '/html' + '/report_list.html');
    });
    app.get('/import', (req, res) => {
        res.sendFile(projectPath + '/html' + '/import.html');
    });

}
module.exports = {defineHTMLEndpoints};