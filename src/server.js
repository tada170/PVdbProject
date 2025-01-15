const express = require("express");
const app = express()
const db = require('./models')

const path = require('path')
const projectPath = path.join(__dirname, "..");
const session = require('express-session');
const cors = require("cors");
const bodyParser = require("body-parser");

const {Allergen} = require('./models')
const {Category} = require('./models')
const {Product} = require('./models')
const {ProductAllergen} = require('./models')
const {TransactionItem} = require('./models')
const {Transactions} = require('./models')
const {defineAPIEndpoints} = require("./routes/api");
const {defineHTMLEndpoints} = require("./pages")


app.get('/insert', (req, res) => {
    Product.create({
        Name: 'Spagety',
        Price: 10.50,
        CategoryID: 1
    }).then(() => {
        res.send('insert');
    }).catch(err => {
        console.log(err);
        res.status(400).send('Chyba při vkládání');
    });
});

app.get('/transaction', async (req, res) => {
    const t = await db.transaction();

    try {
        const newProduct = await Product.create({
            Name: 'Spagheti',
            Price: 10.50,
            CategoryID: 1
        }, { transaction: t });

        const updatedCategory = await Category.update(
            { Name: 'New Category' },
            { where: { CategoryID: 1 }, transaction: t }
        );

        await t.commit();
        res.send('Transaction completed successfully!');
    } catch (err) {
        await t.rollback();
        console.log('Error during transaction:', err);
        res.status(500).send('Transaction failed');
    }
});
app.get('/delete',(req, res) =>{
    Product.destroy({where:{ProductID: 1}});
    res.send('delete')
});

configureApp(app);
defineAPIEndpoints(app);
defineHTMLEndpoints(app);
startServer();

function startServer(){
    db.sequelize.sync().then((req) => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        });
    });
}

function configureApp(app) {
    app.use(session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
        }
    }));

    app.use(express.static(path.join(projectPath, "public")));
    app.use(cors());
    app.use(bodyParser.json());
}