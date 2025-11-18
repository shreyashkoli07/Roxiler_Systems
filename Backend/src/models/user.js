const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.STRING(400) },
    role: { type: DataTypes.ENUM('ADMIN', 'USER', 'STORE_OWNER'), defaultValue: 'USER' }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Rating, { as: 'ratings', foreignKey: 'user_id' });
    User.hasMany(models.Store, { as: 'stores', foreignKey: 'owner_id' });   // ADDED
  };

  return User;
};
