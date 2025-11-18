const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    rating: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.STRING(500), allowNull: true },
  }, {
    tableName: 'ratings',
    timestamps: false
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Store, { as: 'store', foreignKey: 'store_id' });
    Rating.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return Rating;
};
