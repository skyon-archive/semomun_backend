module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Notices',
    {
      nid: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.TEXT('tiny'), allowNull: false },
      text: { type: DataTypes.TEXT(), allowNull: false },
      image: { type: DataTypes.STRING(256), allowNull: true },
      // createdAt: DataTypes.DATE, // Sequelize ORM v5's TIMESTAMP
      // updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'Notices',
      indexes: [{ name: 'PRIMARY', unique: true, using: 'BTREE', fields: [{ name: 'nid' }] }],
    }
  );
};
