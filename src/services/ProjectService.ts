import { ProjectRepository } from '@repositories/ProjectRepository';
import { cacheManager } from '@utils/cache-mock';

export interface CreateProjectDTO {
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectFilters {
  status?: 'active' | 'inactive' | 'completed';
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectDTO): Promise<any> {
    this.validateProjectData(data);

    const project = await this.projectRepository.create(data);
    
    // Invalidate cache
    await cacheManager.invalidateProjectCache(project.id);
    
    return project.toJSON();
  }

  /**
   * Get all projects with optional filters and caching
   */
  async getProjects(filters?: ProjectFilters, page: number = 1, limit: number = 10): Promise<{
    projects: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    console.log('🔍 getProjects called with:', { filters, page, limit });
    
    try {
      // ULTRA SIMPLE VERSION - no offset, no limit, no complex queries
      console.log('📊 Calling projectRepository.findAll() - ultra simple');
      const allProjects = await this.projectRepository.findAll();
      console.log('📋 Found total projects:', allProjects.length);
      
      // Manual pagination
      const total = allProjects.length;
      const offset = (page - 1) * limit;
      const paginatedProjects = allProjects.slice(offset, offset + limit);
      
      console.log('📋 Paginated projects:', paginatedProjects.length);
      
      return {
        projects: paginatedProjects.map(p => {
          try {
            return p.toJSON();
          } catch (jsonError) {
            console.error('⚠️ Error converting project to JSON:', jsonError);
            return { 
              id: p.id, 
              name: p.name, 
              description: p.description, 
              status: p.status 
            };
          }
        }),
        pagination: {
          page: parseInt(String(page)),
          limit: parseInt(String(limit)),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('❌ DETAILED Error in getProjects:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Get project by ID with tasks and GitHub repos
   */
  async getProjectById(id: number, includeRelations: boolean = true): Promise<any> {
    const cacheKey = cacheManager.generateKey('project', id, includeRelations ? 'with-relations' : 'simple');
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        let project;
        
        if (includeRelations) {
          project = await this.projectRepository.findWithTasksAndRepos(id);
        } else {
          project = await this.projectRepository.findById(id);
        }

        if (!project) {
          throw new Error(`Project with ID ${id} not found`);
        }

        return project.toJSON();
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Update project
   */
  async updateProject(id: number, data: UpdateProjectDTO): Promise<any> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }

    this.validateProjectData(data, true);

    const [affectedRows, updatedProjects] = await this.projectRepository.update(id, data);
    
    if (affectedRows === 0) {
      throw new Error(`Failed to update project with ID ${id}`);
    }

    // Invalidate cache
    await cacheManager.invalidateProjectCache(id);
    
    // Return updated project with relations
    return await this.getProjectById(id, true);
  }

  /**
   * Delete project
   */
  async deleteProject(id: number): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }

    await this.projectRepository.delete(id);
    
    // Invalidate cache
    await cacheManager.invalidateProjectCache(id);
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<{
    totalProjects: number;
    statusCounts: { [key: string]: number };
    recentProjects: any[];
  }> {
    const cacheKey = cacheManager.generateKey('project_stats');
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const [total, statusCounts, recent] = await Promise.all([
          this.projectRepository.count(),
          this.projectRepository.countByStatus(),
          this.projectRepository.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
          }),
        ]);

        return {
          totalProjects: total,
          statusCounts,
          recentProjects: recent.map(p => p.toJSON()),
        };
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Search projects by name or description
   */
  async searchProjects(query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const projects = await this.projectRepository.search(query.trim());
    return projects.map(p => p.toJSON());
  }

  /**
   * Get active projects
   */
  async getActiveProjects(): Promise<any[]> {
    const cacheKey = cacheManager.generateKey('active_projects');
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const projects = await this.projectRepository.findActiveProjects();
        return projects.map(p => p.toJSON());
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Validate project data
   */
  private validateProjectData(data: CreateProjectDTO | UpdateProjectDTO, isUpdate: boolean = false): void {
    if (!isUpdate && !data.name) {
      throw new Error('Project name is required');
    }

    if (data.name && data.name.trim().length < 2) {
      throw new Error('Project name must be at least 2 characters long');
    }

    if (data.name && data.name.length > 255) {
      throw new Error('Project name must not exceed 255 characters');
    }

    if (data.description && data.description.length > 5000) {
      throw new Error('Project description must not exceed 5000 characters');
    }

    if (data.status && !['active', 'inactive', 'completed'].includes(data.status)) {
      throw new Error('Project status must be active, inactive, or completed');
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error('Project start date must be before end date');
    }

    // Validate dates are not in the past for new projects (unless updating)
    if (!isUpdate && data.startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(data.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Project start date cannot be in the past');
      }
    }
  }

  /**
   * Get projects by date range
   */
  async getProjectsByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    const projects = await this.projectRepository.findByDateRange(startDate, endDate);
    return projects.map(p => p.toJSON());
  }

  /**
   * Get project with tasks only
   */
  async getProjectWithTasks(id: number): Promise<any> {
    const project = await this.projectRepository.findWithTasks(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project.toJSON();
  }

  /**
   * Get project with GitHub repos only
   */
  async getProjectWithGithubRepos(id: number): Promise<any> {
    const project = await this.projectRepository.findWithGithubRepos(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project.toJSON();
  }
}
