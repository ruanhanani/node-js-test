'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    await queryInterface.bulkInsert('tasks', [
      // Tasks for Project 1 (E-commerce)
      {
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Setup inicial do projeto com Node.js, React e banco de dados',
        status: 'completed',
        priority: 'high',
        due_date: '2024-01-20',
        project_id: 1,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Desenvolver API de usuários',
        description: 'Implementar endpoints para registro, login e gerenciamento de usuários',
        status: 'in_progress',
        priority: 'high',
        due_date: tomorrow.toISOString().split('T')[0],
        project_id: 1,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Criar interface de produtos',
        description: 'Desenvolver componentes React para listagem e detalhes dos produtos',
        status: 'pending',
        priority: 'medium',
        due_date: nextWeek.toISOString().split('T')[0],
        project_id: 1,
        created_at: now,
        updated_at: now
      },
      
      // Tasks for Project 2 (API Payments)
      {
        title: 'Integrar gateway PagSeguro',
        description: 'Implementar integração com API do PagSeguro para processamento de pagamentos',
        status: 'in_progress',
        priority: 'critical',
        due_date: '2024-02-15',
        project_id: 2,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Implementar webhook de notificações',
        description: 'Criar endpoint para receber notificações de status de pagamento',
        status: 'pending',
        priority: 'high',
        due_date: '2024-02-20',
        project_id: 2,
        created_at: now,
        updated_at: now
      },
      
      // Tasks for Project 3 (Dashboard)
      {
        title: 'Criar gráficos de vendas',
        description: 'Implementar gráficos interativos usando Chart.js',
        status: 'completed',
        priority: 'medium',
        due_date: '2023-11-15',
        project_id: 3,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Otimizar performance das consultas',
        description: 'Melhorar performance das queries do banco de dados',
        status: 'completed',
        priority: 'high',
        due_date: '2023-12-01',
        project_id: 3,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
