'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('projects', [
      {
        name: 'Sistema de E-commerce',
        description: 'Desenvolvimento de uma plataforma completa de e-commerce com React e Node.js',
        status: 'active',
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        created_at: now,
        updated_at: now
      },
      {
        name: 'API REST de Pagamentos',
        description: 'API para processamento de pagamentos integrada com múltiplos gateways',
        status: 'active',
        start_date: '2024-02-01',
        end_date: '2024-04-15',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Dashboard Analytics',
        description: 'Dashboard para visualização de métricas e relatórios em tempo real',
        status: 'completed',
        start_date: '2023-10-01',
        end_date: '2023-12-31',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
  }
};
