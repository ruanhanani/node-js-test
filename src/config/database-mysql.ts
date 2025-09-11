import { Sequelize } from 'sequelize-typescript';
import { Project } from '@models/Project';
import { Task } from '@models/Task';
import { GitHubRepo } from '@models/GitHubRepo';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'nodetest_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'rootpassword',
  logging: console.log, // Enable SQL logging to debug issues
  models: [Project, Task, GitHubRepo],
  define: {
    timestamps: true,
    underscored: false,
  },
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
    
    // Sync database (alters tables to match models)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');
    
    // Seed database with mock data only if tables are empty
    const projectCount = await Project.count();
    if (projectCount === 0) {
      await seedDatabase();
      console.log('✅ Database seeded with mock data.');
    } else {
      console.log('✅ Database already has data, skipping seed.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error);
    console.log('🔍 Make sure MySQL is running on port 3306');
    console.log('🔍 Check your database credentials in .env');
    process.exit(1);
  }
}

// Seed database with mock data
async function seedDatabase(): Promise<void> {
  try {
    // Create sample projects
    const project1 = await Project.create({
      name: 'E-commerce Platform',
      description: 'Complete e-commerce solution with React and Node.js',
      status: 'active',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
    });

    const project2 = await Project.create({
      name: 'Mobile App',
      description: 'Cross-platform mobile application using React Native',
      status: 'active',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-08-31'),
    });

    const project3 = await Project.create({
      name: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard with real-time analytics',
      status: 'completed',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
    });

    // Create sample tasks
    await Task.create({
      title: 'Setup project structure',
      description: 'Initialize the project with proper folder structure and dependencies',
      status: 'completed',
      priority: 'high',
      projectId: project1.id,
      dueDate: new Date('2025-01-15'),
    });

    await Task.create({
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication system with login and registration',
      status: 'in_progress',
      priority: 'critical',
      projectId: project1.id,
      dueDate: new Date('2025-02-28'),
    });

    await Task.create({
      title: 'Design product catalog',
      description: 'Create responsive product listing and detail pages',
      status: 'pending',
      priority: 'medium',
      projectId: project1.id,
      dueDate: new Date('2025-03-15'),
    });

    await Task.create({
      title: 'Setup React Native environment',
      description: 'Configure development environment for iOS and Android',
      status: 'completed',
      priority: 'high',
      projectId: project2.id,
      dueDate: new Date('2025-02-10'),
    });

    await Task.create({
      title: 'Implement navigation',
      description: 'Setup navigation system using React Navigation',
      status: 'in_progress',
      priority: 'medium',
      projectId: project2.id,
      dueDate: new Date('2025-03-01'),
    });

    await Task.create({
      title: 'Deploy dashboard',
      description: 'Deploy the analytics dashboard to production',
      status: 'completed',
      priority: 'high',
      projectId: project3.id,
      dueDate: new Date('2024-12-30'),
    });

    // Create sample GitHub repositories
    await GitHubRepo.create({
      githubId: 123456789,
      name: 'ecommerce-frontend',
      fullName: 'testuser/ecommerce-frontend',
      description: 'Frontend for e-commerce platform built with React',
      htmlUrl: 'https://github.com/testuser/ecommerce-frontend',
      cloneUrl: 'https://github.com/testuser/ecommerce-frontend.git',
      language: 'TypeScript',
      stargazersCount: 42,
      forksCount: 8,
      private: false,
      username: 'testuser',
      projectId: project1.id,
      githubCreatedAt: new Date('2025-01-01'),
      githubUpdatedAt: new Date('2025-01-20'),
    });

    await GitHubRepo.create({
      githubId: 987654321,
      name: 'ecommerce-backend',
      fullName: 'testuser/ecommerce-backend',
      description: 'Backend API for e-commerce platform built with Node.js',
      htmlUrl: 'https://github.com/testuser/ecommerce-backend',
      cloneUrl: 'https://github.com/testuser/ecommerce-backend.git',
      language: 'JavaScript',
      stargazersCount: 35,
      forksCount: 12,
      private: false,
      username: 'testuser',
      projectId: project1.id,
      githubCreatedAt: new Date('2025-01-01'),
      githubUpdatedAt: new Date('2025-01-25'),
    });

    await GitHubRepo.create({
      githubId: 456789123,
      name: 'mobile-app-rn',
      fullName: 'testuser/mobile-app-rn',
      description: 'Cross-platform mobile app built with React Native',
      htmlUrl: 'https://github.com/testuser/mobile-app-rn',
      cloneUrl: 'https://github.com/testuser/mobile-app-rn.git',
      language: 'TypeScript',
      stargazersCount: 28,
      forksCount: 5,
      private: false,
      username: 'testuser',
      projectId: project2.id,
      githubCreatedAt: new Date('2025-02-01'),
      githubUpdatedAt: new Date('2025-02-15'),
    });

    console.log('📊 Created 3 projects, 6 tasks, and 3 GitHub repositories');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
