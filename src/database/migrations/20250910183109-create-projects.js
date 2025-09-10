'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'completed'),
        allowNull: false,
        defaultValue: 'active'
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'start_date'
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'end_date'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });

    // Add indexes
    await queryInterface.addIndex('projects', ['status']);
    await queryInterface.addIndex('projects', ['start_date']);
    await queryInterface.addIndex('projects', ['end_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};
