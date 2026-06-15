'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        references: { model: 'stores', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.addConstraint('ratings', {
      fields: ['user_id', 'store_id'],
      type: 'unique',
      name: 'unique_user_store_rating'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ratings');
  }
};