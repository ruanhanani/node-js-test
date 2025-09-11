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
export declare class ProjectService {
    private projectRepository;
    constructor();
    /**
     * Create a new project
     */
    createProject(data: CreateProjectDTO): Promise<any>;
    /**
     * Get all projects with optional filters and caching
     */
    getProjects(filters?: ProjectFilters, page?: number, limit?: number): Promise<{
        projects: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Get project by ID with tasks and GitHub repos
     */
    getProjectById(id: number, includeRelations?: boolean): Promise<any>;
    /**
     * Update project
     */
    updateProject(id: number, data: UpdateProjectDTO): Promise<any>;
    /**
     * Delete project
     */
    deleteProject(id: number): Promise<void>;
    /**
     * Get project statistics
     */
    getProjectStats(): Promise<{
        totalProjects: number;
        statusCounts: {
            [key: string]: number;
        };
        recentProjects: any[];
    }>;
    /**
     * Search projects by name or description
     */
    searchProjects(query: string): Promise<any[]>;
    /**
     * Get active projects
     */
    getActiveProjects(): Promise<any[]>;
    /**
     * Validate project data
     */
    private validateProjectData;
    /**
     * Get projects by date range
     */
    getProjectsByDateRange(startDate: Date, endDate: Date): Promise<any[]>;
    /**
     * Get project with tasks only
     */
    getProjectWithTasks(id: number): Promise<any>;
    /**
     * Get project with GitHub repos only
     */
    getProjectWithGithubRepos(id: number): Promise<any>;
}
//# sourceMappingURL=ProjectService.d.ts.map