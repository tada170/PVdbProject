module.exports = (sequelize,DataTypes) =>{
    return sequelize.define('Allergen', {
        AllergenID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
                            'Molluscs'
                        ]
                    ]
                }
            }
        }
    });
};