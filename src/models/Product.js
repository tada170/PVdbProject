module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        ProductID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        CategoryID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories',
                key: 'CategoryID',
            },
            onDelete: 'SET NULL',
        },
    });

    Product.associate = (models) => {
        Product.hasMany(models.ProductAllergen, {
            foreignKey: 'ProductID',
            as: 'allergens',
        });
    };

    return Product;
};
