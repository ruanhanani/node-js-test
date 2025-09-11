import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from '@config/database-mysql';
import { redisClient } from '@config/redis';
import { swaggerUi, swaggerSpec } from '@config/swagger';
import projectRoutes from '@routes/projectRoutes';
import taskRoutes from '@routes/taskRoutes';
import projectTaskRoutes from '@routes/projectTaskRoutes';
import { simpleRoutes } from '@routes/simple';
import testRoutes from '@routes/testRoutes';
import {
  globalErrorHandler,
  notFoundHandler,
  requestLogger,
  rateLimit,
  corsMiddleware,
} from '@middlewares/errorHandler';

class App {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT!) || 3000;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security and performance middlewares - TEMPORARILY DISABLED
    // this.app.use(helmet());
    // this.app.use(compression());
    // this.app.use(corsMiddleware);
    
    // Rate limiting - TEMPORARILY DISABLED
    // this.app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
    
    // Request parsing - MINIMAL
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logging - TEMPORARILY DISABLED
    // this.app.use(requestLogger);
    
    // Trust proxy for accurate IP addresses
    // this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API está funcionando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
      });
    });

    // API documentation endpoint
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Node.js Test API - Gerenciador de Projetos e Tarefas',
        version: '1.0.0',
        documentation: {
          endpoints: {
            projects: {
              'GET /api/projects': 'Lista todos os projetos',
              'POST /api/projects': 'Cria um novo projeto',
              'GET /api/projects/:id': 'Busca projeto por ID',
              'PUT /api/projects/:id': 'Atualiza projeto',
              'DELETE /api/projects/:id': 'Remove projeto',
              'GET /api/projects/:id/tasks': 'Lista tarefas do projeto',
              'POST /api/projects/:projectId/tasks': 'Cria tarefa no projeto',
              'GET /api/projects/:id/github/:username': 'Busca repositórios GitHub',
            },
            tasks: {
              'GET /api/tasks': 'Lista todas as tarefas',
              'POST /api/tasks': 'Cria uma nova tarefa',
              'GET /api/tasks/:id': 'Busca tarefa por ID',
              'PUT /api/tasks/:id': 'Atualiza tarefa',
              'DELETE /api/tasks/:id': 'Remove tarefa',
              'PATCH /api/tasks/:id/complete': 'Marca tarefa como concluída',
              'PATCH /api/tasks/:id/start': 'Marca tarefa como em progresso',
              'PATCH /api/tasks/:id/cancel': 'Cancela tarefa',
            },
            utilities: {
              'GET /health': 'Status da API',
              'GET /api/projects/stats': 'Estatísticas dos projetos',
              'GET /api/tasks/stats': 'Estatísticas das tarefas',
              'GET /api/projects/search?q=term': 'Busca projetos',
              'GET /api/tasks/search?q=term': 'Busca tarefas',
            },
          },
          features: [
            '✅ CRUD completo de Projetos e Tarefas',
            '✅ Integração com GitHub API',
            '✅ Cache Redis (TTL: 10 minutos)',
            '✅ Arquitetura em camadas',
            '✅ Validação de dados com Joi',
            '✅ Tratamento de erros robusto',
            '✅ Paginação e filtros',
            '✅ Documentação automática',
          ],
        },
        author: 'Ruan Hanani',
        timestamp: new Date().toISOString(),
      });
    });

    // Swagger documentation - TEMPORARILY DISABLED
    // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    // Simple API routes (for testing)
    this.app.use('/api/simple', simpleRoutes);
    
    // Test routes for debugging
    this.app.use('/api/test', testRoutes);
    
    // Full API routes
    this.app.use('/api/projects', projectRoutes);
    this.app.use('/api/projects', projectTaskRoutes);
    this.app.use('/api/tasks', taskRoutes);

    // API status endpoint
    this.app.get('/api', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API REST Node.js - Projetos e Tarefas',
        endpoints: [
          'GET /api/projects - Lista projetos',
          'POST /api/projects - Cria projeto',
          'GET /api/projects/:id - Busca projeto',
          'PUT /api/projects/:id - Atualiza projeto',
          'DELETE /api/projects/:id - Remove projeto',
          'GET /api/projects/:id/tasks - Tarefas do projeto',
          'POST /api/projects/:projectId/tasks - Cria tarefa',
          'GET /api/projects/:id/github/:username - Repositórios GitHub',
          'GET /api/tasks - Lista tarefas',
          'POST /api/tasks - Cria tarefa',
          'GET /api/tasks/:id - Busca tarefa',
          'PUT /api/tasks/:id - Atualiza tarefa',
          'DELETE /api/tasks/:id - Remove tarefa',
        ],
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(globalErrorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      
      // Connect to Redis
      // await redisClient.connect();
      console.log('✅ Redis connection skipped for testing');
      
      // Start server
      this.app.listen(this.port, () => {
        console.log('🚀 ================================');
        console.log('🚀 Node.js Test API');
        console.log('🚀 ================================');
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🚀 API Base URL: http://localhost:${this.port}`);
        console.log(`🚀 Health Check: http://localhost:${this.port}/health`);
        console.log(`🚀 API Docs: http://localhost:${this.port}/`);
        console.log(`📚 Swagger UI: http://localhost:${this.port}/api-docs`);
        console.log('🚀 ================================');
        console.log('🚀 Available Endpoints:');
        console.log('🚀 GET  /api/projects');
        console.log('🚀 POST /api/projects');
        console.log('🚀 GET  /api/projects/:id');
        console.log('🚀 PUT  /api/projects/:id');
        console.log('🚀 DEL  /api/projects/:id');
        console.log('🚀 GET  /api/projects/:id/tasks');
        console.log('🚀 POST /api/projects/:projectId/tasks');
        console.log('🚀 GET  /api/projects/:id/github/:username');
        console.log('🚀 GET  /api/tasks');
        console.log('🚀 POST /api/tasks');
        console.log('🚀 GET  /api/tasks/:id');
        console.log('🚀 PUT  /api/tasks/:id');
        console.log('🚀 DEL  /api/tasks/:id');
        console.log('🚀 ================================');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Start the application
const app = new App();
app.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  
  try {
    await redisClient.disconnect();
    console.log('✅ Redis disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Redis:', error);
  }
  
  console.log('✅ Server shut down successfully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
  
  try {
    await redisClient.disconnect();
    console.log('✅ Redis disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Redis:', error);
  }
  
  console.log('✅ Server shut down successfully');
  process.exit(0);
});

export default app;
