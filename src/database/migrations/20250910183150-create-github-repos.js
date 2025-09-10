'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('github_repos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      githubId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        field: 'github_id'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      fullName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'full_name'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      htmlUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
        field: 'html_url'
      },
      cloneUrl: {
        type: Sequelize.STRING(500),
        allowNull: false,
        field: 'clone_url'
      },
      language: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      stargazersCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'stargazers_count'
      },
      forksCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'forks_count'
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      githubCreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'github_created_at'
      },
      githubUpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'github_updated_at'
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'project_id',
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('github_repos', ['github_id'], { unique: true });
    await queryInterface.addIndex('github_repos', ['username', 'project_id']);
    await queryInterface.addIndex('github_repos', ['project_id']);
    await queryInterface.addIndex('github_repos', ['language']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('github_repos');
  }
};
