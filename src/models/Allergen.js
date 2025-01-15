module.exports = (sequelize, DataTypes) => {
    const Allergen = sequelize.define('Allergen', {
        AllergenID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: {
                    args: [
                        [
                            'Gluten',
                            'Crustaceans',
                            'Eggs',
                            'Fish',
                            'Peanuts',
                            'Soybeans',
                            'Milk',
                            'Nuts',
                            'Celery',
                            'Mustard',
                            'Sesame seeds',
                            'Sulphur dioxide',
                            'Lupin',
                            'Molluscs',
                            'No allergen'
                        ],
                    ],
                },
            },
        },
    });

    Allergen.associate = (models) => {
        Allergen.hasMany(models.ProductAllergen, {
            foreignKey: 'AllergenID',
            as: 'productAllergens',
        });
    };

    return Allergen;
};
