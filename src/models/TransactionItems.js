const trace_events = require("node:trace_events");
module.exports = (sequelize, DataTypes) => {
    const TransactionItems = sequelize.define('TransactionItem', {
        TransactionItemID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TransactionID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Transactions',
                key: 'TransactionID'
            }
        },
        ProductID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Products',
                key: 'ProductID'
            }
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        Paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return TransactionItems;
};
