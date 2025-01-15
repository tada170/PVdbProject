module.exports = (sequelize, DataTypes) => {
    const TransactionDetail = sequelize.define('TransactionDetail', {
        TransactionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        TransactionName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        TransactionDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        TransactionItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ProductName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        Paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        AllergenName: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'TransactionDetail', // Corresponds to the view name in your DB
        timestamps: false,  // Disables timestamps since views typically don't have them
        underscored: true,  // Optional: Makes Sequelize use snake_case instead of camelCase
        freezeTableName: true, // Prevent Sequelize from pluralizing the table name
        createdAt: false,     // No createdAt field for views
        updatedAt: false,     // No updatedAt field for views
    });

    return TransactionDetail;
};
