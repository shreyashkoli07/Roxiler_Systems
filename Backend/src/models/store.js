const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true },
    address: { type: DataTypes.STRING(400), allowNull: true },
    average_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    owner_id: { type: DataTypes.BIGINT, allowNull: false }
  }, {
    tableName: 'stores',
    timestamps: false
  });

  Store.associate = (models) => {
    Store.hasMany(models.Rating, { as: 'ratings', foreignKey: 'store_id' });
    Store.belongsTo(models.User, { as: 'owner', foreignKey: 'owner_id' });
  };

  return Store;
};
