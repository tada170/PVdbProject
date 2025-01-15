module.exports = (sequelize, DataTypes) => {
    const ProductAllergen = sequelize.define('ProductAllergen', {
        ProductID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Products',
                key: 'ProductID',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        AllergenID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Allergens',
                key: 'AllergenID',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
    });

    ProductAllergen.associate = (models) => {
        ProductAllergen.belongsTo(models.Product, {
            foreignKey: 'ProductID',
            as: 'product',
        });
    };

    return ProductAllergen;
};
