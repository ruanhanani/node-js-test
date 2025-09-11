"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const ProjectRepository_1 = require("@repositories/ProjectRepository");
const cache_mock_1 = require("@utils/cache-mock");
class ProjectService {
    constructor() {
        this.projectRepository = new ProjectRepository_1.ProjectRepository();
    }
    /**
     * Create a new project
     */
    async createProject(data) {
        this.validateProjectData(data);
        const project = await this.projectRepository.create(data);
        // Invalidate cache
        await cache_mock_1.cacheManager.invalidateProjectCache(project.id);
        return project.toJSON();
    }
    /**
     * Get all projects with optional filters and caching
     */
    async getProjects(filters, page = 1, limit = 10) {
        const cacheKey = cache_mock_1.cacheManager.generateKey('projects', JSON.stringify(filters || {}), page, limit);
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const offset = (page - 1) * limit;
            let projects;
            let total;
            if (filters?.search) {
                projects = await this.projectRepository.search(filters.search);
                total = projects.length;
                projects = projects.slice(offset, offset + limit);
            }
            else if (filters?.status) {
                projects = await this.projectRepository.findByStatus(filters.status);
                total = projects.length;
                projects = projects.slice(offset, offset + limit);
            }
            else if (filters?.startDate && filters?.endDate) {
                projects = await this.projectRepository.findByDateRange(filters.startDate, filters.endDate);
                total = projects.length;
                projects = projects.slice(offset, offset + limit);
            }
            else {
                const result = await this.projectRepository.findAllWithCounts(limit, offset);
                projects = result.rows;
                total = result.count;
            }
            return {
                projects: projects.map(p => p.toJSON()),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Get project by ID with tasks and GitHub repos
     */
    async getProjectById(id, includeRelations = true) {
        const cacheKey = cache_mock_1.cacheManager.generateKey('project', id, includeRelations ? 'with-relations' : 'simple');
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            let project;
            if (includeRelations) {
                project = await this.projectRepository.findWithTasksAndRepos(id);
            }
            else {
                project = await this.projectRepository.findById(id);
            }
            if (!project) {
                throw new Error(`Project with ID ${id} not found`);
            }
            return project.toJSON();
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Update project
     */
    async updateProject(id, data) {
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
        await cache_mock_1.cacheManager.invalidateProjectCache(id);
        // Return updated project with relations
        return await this.getProjectById(id, true);
    }
    /**
     * Delete project
     */
    async deleteProject(id) {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        await this.projectRepository.delete(id);
        // Invalidate cache
        await cache_mock_1.cacheManager.invalidateProjectCache(id);
    }
    /**
     * Get project statistics
     */
    async getProjectStats() {
        const cacheKey = cache_mock_1.cacheManager.generateKey('project_stats');
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
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
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Search projects by name or description
     */
    async searchProjects(query) {
        if (!query || query.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters long');
        }
        const projects = await this.projectRepository.search(query.trim());
        return projects.map(p => p.toJSON());
    }
    /**
     * Get active projects
     */
    async getActiveProjects() {
        const cacheKey = cache_mock_1.cacheManager.generateKey('active_projects');
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const projects = await this.projectRepository.findActiveProjects();
            return projects.map(p => p.toJSON());
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Validate project data
     */
    validateProjectData(data, isUpdate = false) {
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
        if (!isUpdate && data.startDate && data.startDate < new Date()) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (data.startDate < today) {
                throw new Error('Project start date cannot be in the past');
            }
        }
    }
    /**
     * Get projects by date range
     */
    async getProjectsByDateRange(startDate, endDate) {
        if (startDate > endDate) {
            throw new Error('Start date must be before end date');
        }
        const projects = await this.projectRepository.findByDateRange(startDate, endDate);
        return projects.map(p => p.toJSON());
    }
    /**
     * Get project with tasks only
     */
    async getProjectWithTasks(id) {
        const project = await this.projectRepository.findWithTasks(id);
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        return project.toJSON();
    }
    /**
     * Get project with GitHub repos only
     */
    async getProjectWithGithubRepos(id) {
        const project = await this.projectRepository.findWithGithubRepos(id);
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        return project.toJSON();
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=ProjectService.js.map