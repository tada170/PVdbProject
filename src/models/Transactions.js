module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Transactions', {
        TransactionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        TransactionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
};
