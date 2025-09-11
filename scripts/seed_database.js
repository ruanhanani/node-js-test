const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Configuração do banco de dados (mesma da aplicação)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'rootpassword',
  database: process.env.DB_NAME || 'nodetest_db',
  multipleStatements: true
};

async function seedDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL com sucesso!');

    // Executar comandos SQL individualmente
    console.log('🚀 Executando script de seeding...');
    
    // Verificar estrutura das tabelas
    console.log('🔍 Verificando estrutura das tabelas...');
    const [projectsStructure] = await connection.execute('DESCRIBE projects');
    console.log('Estrutura da tabela projects:', projectsStructure);
    
    const [tasksStructure] = await connection.execute('DESCRIBE tasks');
    console.log('Estrutura da tabela tasks:', tasksStructure);
    
    const [reposStructure] = await connection.execute('DESCRIBE github_repos');
    console.log('Estrutura da tabela github_repos:', reposStructure);
    
    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await connection.execute('DELETE FROM github_repos');
    await connection.execute('DELETE FROM tasks');
    await connection.execute('DELETE FROM projects');
    
    // Resetar auto_increment
    await connection.execute('ALTER TABLE projects AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE tasks AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE github_repos AUTO_INCREMENT = 1');
    
    // Inserir projetos
    console.log('📁 Inserindo projetos...');
    await connection.execute(`
      INSERT INTO projects (name, description, status, startDate, endDate, createdAt, updatedAt) VALUES
      ('E-commerce Platform', 'Desenvolvimento de plataforma completa de e-commerce com React e Node.js', 'active', '2024-01-15', '2024-06-30', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
      ('Mobile App Development', 'Aplicativo mobile para gestão de tarefas usando React Native', 'active', '2024-02-01', '2024-08-31', '2024-02-01 14:30:00', '2024-02-20 16:45:00'),
      ('Data Analytics Dashboard', 'Dashboard para análise de dados com visualizações interativas', 'completed', '2024-01-10', '2024-03-15', '2024-01-10 09:15:00', '2024-03-15 18:20:00'),
      ('API Management System', 'Sistema de gerenciamento e documentação de APIs', 'active', '2024-03-01', '2024-09-30', '2024-03-01 11:20:00', '2024-03-10 13:30:00'),
      ('Blockchain Wallet', 'Carteira digital para criptomoedas com segurança avançada', 'inactive', '2024-02-15', '2024-12-31', '2024-02-15 08:45:00', '2024-02-25 12:00:00')
    `);
    
    // Inserir tarefas
    console.log('✅ Inserindo tarefas...');
    await connection.execute(`
      INSERT INTO tasks (title, description, status, priority, dueDate, projectId, createdAt, updatedAt) VALUES
      ('Configurar ambiente de desenvolvimento', 'Instalar e configurar Node.js, React, MySQL e ferramentas necessárias', 'completed', 'high', '2024-01-20', 1, '2024-01-15 10:30:00', '2024-01-18 16:00:00'),
      ('Desenvolver sistema de autenticação', 'Implementar login, registro e recuperação de senha', 'completed', 'high', '2024-02-01', 1, '2024-01-18 09:00:00', '2024-01-30 17:30:00'),
      ('Criar catálogo de produtos', 'Desenvolver interface para listagem e busca de produtos', 'in_progress', 'high', '2024-02-15', 1, '2024-01-25 14:00:00', '2024-02-10 11:20:00'),
      ('Implementar carrinho de compras', 'Sistema completo de carrinho com cálculo de frete', 'pending', 'medium', '2024-02-28', 1, '2024-02-01 10:15:00', '2024-02-01 10:15:00'),
      ('Integração com gateway de pagamento', 'Conectar com Stripe/PayPal para processamento de pagamentos', 'pending', 'high', '2024-03-10', 1, '2024-02-05 15:45:00', '2024-02-05 15:45:00'),
      ('Setup do projeto React Native', 'Configurar estrutura inicial do app mobile', 'completed', 'high', '2024-02-05', 2, '2024-02-01 15:00:00', '2024-02-04 18:00:00'),
      ('Desenvolver tela de login', 'Interface de autenticação para dispositivos móveis', 'completed', 'medium', '2024-02-10', 2, '2024-02-04 09:30:00', '2024-02-09 14:20:00'),
      ('Criar sistema de notificações push', 'Implementar notificações para lembretes de tarefas', 'in_progress', 'medium', '2024-02-25', 2, '2024-02-08 11:00:00', '2024-02-20 16:45:00'),
      ('Desenvolver interface de gestão de tarefas', 'CRUD completo para tarefas no mobile', 'pending', 'high', '2024-03-05', 2, '2024-02-12 13:20:00', '2024-02-12 13:20:00'),
      ('Análise de requisitos de dados', 'Levantar fontes de dados e métricas necessárias', 'completed', 'high', '2024-01-20', 3, '2024-01-10 09:30:00', '2024-01-18 16:45:00'),
      ('Configurar pipeline de dados', 'ETL para processamento e transformação de dados', 'completed', 'high', '2024-02-01', 3, '2024-01-20 10:00:00', '2024-01-28 19:00:00'),
      ('Desenvolver gráficos interativos', 'Implementar visualizações com Chart.js/D3.js', 'completed', 'medium', '2024-02-15', 3, '2024-01-25 14:30:00', '2024-02-12 17:15:00'),
      ('Deploy em produção', 'Configurar ambiente de produção e monitoramento', 'completed', 'medium', '2024-03-01', 3, '2024-02-28 08:00:00', '2024-03-15 18:20:00'),
      ('Documentação da arquitetura', 'Definir estrutura e padrões da API', 'completed', 'high', '2024-03-05', 4, '2024-03-01 11:30:00', '2024-03-04 15:00:00'),
      ('Implementar autenticação JWT', 'Sistema de tokens para segurança das APIs', 'in_progress', 'high', '2024-03-15', 4, '2024-03-05 09:00:00', '2024-03-10 13:30:00'),
      ('Criar sistema de rate limiting', 'Controle de limite de requisições por usuário', 'pending', 'medium', '2024-03-20', 4, '2024-03-08 16:20:00', '2024-03-08 16:20:00'),
      ('Pesquisa de tecnologias blockchain', 'Estudo de diferentes blockchains e protocolos', 'completed', 'high', '2024-02-20', 5, '2024-02-15 09:00:00', '2024-02-19 17:30:00'),
      ('Prototipagem da interface', 'Mockups e wireframes da carteira digital', 'in_progress', 'medium', '2024-03-01', 5, '2024-02-20 10:15:00', '2024-02-25 12:00:00'),
      ('Implementar criptografia avançada', 'Sistema de segurança para chaves privadas', 'pending', 'high', '2024-03-15', 5, '2024-02-22 14:45:00', '2024-02-22 14:45:00')
    `);
    
    // Inserir repositórios GitHub
    console.log('📦 Inserindo repositórios GitHub...');
    await connection.execute(`
      INSERT INTO github_repos (githubId, name, fullName, description, htmlUrl, cloneUrl, language, stargazersCount, forksCount, private, username, githubCreatedAt, githubUpdatedAt, projectId, createdAt, updatedAt) VALUES
      (123456789, 'ecommerce-frontend', 'testuser/ecommerce-frontend', 'Frontend para plataforma de e-commerce', 'https://github.com/testuser/ecommerce-frontend', 'https://github.com/testuser/ecommerce-frontend.git', 'JavaScript', 245, 67, 0, 'testuser', '2024-01-15 12:00:00', '2024-02-10 14:30:00', 1, '2024-01-15 12:00:00', '2024-02-10 14:30:00'),
      (987654321, 'ecommerce-backend', 'testuser/ecommerce-backend', 'Backend API para plataforma de e-commerce', 'https://github.com/testuser/ecommerce-backend', 'https://github.com/testuser/ecommerce-backend.git', 'TypeScript', 189, 43, 0, 'testuser', '2024-01-15 12:15:00', '2024-02-08 16:45:00', 1, '2024-01-15 12:15:00', '2024-02-08 16:45:00'),
      (456789123, 'task-manager-mobile', 'testuser/task-manager-mobile', 'App mobile para gestão de tarefas', 'https://github.com/testuser/task-manager-mobile', 'https://github.com/testuser/task-manager-mobile.git', 'React Native', 156, 29, 0, 'testuser', '2024-02-01 15:30:00', '2024-02-20 18:00:00', 2, '2024-02-01 15:30:00', '2024-02-20 18:00:00'),
      (789123456, 'mobile-app-backend', 'testuser/mobile-app-backend', 'Backend para aplicativo mobile', 'https://github.com/testuser/mobile-app-backend', 'https://github.com/testuser/mobile-app-backend.git', 'Node.js', 87, 15, 0, 'testuser', '2024-02-02 09:45:00', '2024-02-15 11:20:00', 2, '2024-02-02 09:45:00', '2024-02-15 11:20:00'),
      (321654987, 'analytics-dashboard', 'testuser/analytics-dashboard', 'Dashboard de análise de dados', 'https://github.com/testuser/analytics-dashboard', 'https://github.com/testuser/analytics-dashboard.git', 'Python', 312, 89, 0, 'testuser', '2024-01-10 10:00:00', '2024-03-15 19:30:00', 3, '2024-01-10 10:00:00', '2024-03-15 19:30:00'),
      (654987321, 'api-management-system', 'testuser/api-management-system', 'Sistema de gerenciamento de APIs', 'https://github.com/testuser/api-management-system', 'https://github.com/testuser/api-management-system.git', 'TypeScript', 198, 52, 0, 'testuser', '2024-03-01 12:30:00', '2024-03-10 15:45:00', 4, '2024-03-01 12:30:00', '2024-03-10 15:45:00'),
      (147258369, 'blockchain-wallet-core', 'testuser/blockchain-wallet-core', 'Núcleo da carteira blockchain', 'https://github.com/testuser/blockchain-wallet-core', 'https://github.com/testuser/blockchain-wallet-core.git', 'Rust', 423, 156, 0, 'testuser', '2024-02-15 11:00:00', '2024-02-25 13:15:00', 5, '2024-02-15 11:00:00', '2024-02-25 13:15:00'),
      (963852741, 'wallet-mobile-interface', 'testuser/wallet-mobile-interface', 'Interface mobile da carteira', 'https://github.com/testuser/wallet-mobile-interface', 'https://github.com/testuser/wallet-mobile-interface.git', 'Flutter', 267, 78, 0, 'testuser', '2024-02-16 14:20:00', '2024-02-24 16:30:00', 5, '2024-02-16 14:20:00', '2024-02-24 16:30:00')
    `);
    
    console.log('✅ Dados inseridos com sucesso!');
    
    // Verificar os dados inseridos
    console.log('\n📊 Verificando dados inseridos:');
    
    // Contar projetos
    const [projectsCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    console.log(`   • Projetos: ${projectsCount[0].count} registros`);
    
    // Contar tarefas
    const [tasksCount] = await connection.execute('SELECT COUNT(*) as count FROM tasks');
    console.log(`   • Tarefas: ${tasksCount[0].count} registros`);
    
    // Contar repositórios
    const [reposCount] = await connection.execute('SELECT COUNT(*) as count FROM github_repos');
    console.log(`   • Repositórios: ${reposCount[0].count} registros`);
    
    // Mostrar alguns dados de exemplo
    console.log('\n📋 Exemplos de dados inseridos:');
    
    const [projects] = await connection.execute('SELECT id, name, status FROM projects LIMIT 3');
    console.log('\n   🏗️ Projetos:');
    projects.forEach(project => {
      console.log(`      • [${project.id}] ${project.name} (${project.status})`);
    });
    
    const [tasks] = await connection.execute('SELECT id, title, status, priority FROM tasks LIMIT 5');
    console.log('\n   ✅ Tarefas:');
    tasks.forEach(task => {
      console.log(`      • [${task.id}] ${task.title} (${task.status} - ${task.priority})`);
    });
    
    const [repos] = await connection.execute('SELECT id, name, language, stargazersCount FROM github_repos LIMIT 3');
    console.log('\n   📦 Repositórios:');
    repos.forEach(repo => {
      console.log(`      • [${repo.id}] ${repo.name} (${repo.language} - ${repo.stargazersCount} stars)`);
    });
    
    console.log('\n🎉 Seeding completado com sucesso!');
    console.log('💡 Agora você pode testar todos os endpoints da API.');
    
  } catch (error) {
    console.error('❌ Erro durante o seeding:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Certifique-se de que o MySQL está rodando e as credenciais estão corretas.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Verifique as credenciais do banco de dados (usuário/senha).');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 O banco de dados "task_manager" não existe. Crie-o primeiro.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão com o banco fechada.');
    }
  }
}

// Executar o seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
