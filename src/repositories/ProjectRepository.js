"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const Project_1 = require("@models/Project");
const Task_1 = require("@models/Task");
const GitHubRepo_1 = require("@models/GitHubRepo");
class ProjectRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Project_1.Project);
    }
    async findWithTasks(id) {
        return await this.findById(id, {
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
            ],
        });
    }
    async findWithGithubRepos(id) {
        return await this.findById(id, {
            include: [
                {
                    model: GitHubRepo_1.GitHubRepo,
                    as: 'githubRepos',
                },
            ],
        });
    }
    async findWithTasksAndRepos(id) {
        return await this.findById(id, {
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
                {
                    model: GitHubRepo_1.GitHubRepo,
                    as: 'githubRepos',
                },
            ],
        });
    }
    async findByStatus(status) {
        return await this.findAll({
            where: {
                status,
            },
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
            ],
        });
    }
    async findActiveProjects() {
        return await this.findByStatus('active');
    }
    async findByDateRange(startDate, endDate) {
        return await this.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        startDate: {
                            [sequelize_1.Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        endDate: {
                            [sequelize_1.Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        [sequelize_1.Op.and]: [
                            {
                                startDate: {
                                    [sequelize_1.Op.lte]: startDate,
                                },
                            },
                            {
                                endDate: {
                                    [sequelize_1.Op.gte]: endDate,
                                },
                            },
                        ],
                    },
                ],
            },
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
            ],
        });
    }
    async countByStatus() {
        const results = await Project_1.Project.findAll({
            attributes: ['status', [Project_1.Project.sequelize.fn('COUNT', Project_1.Project.sequelize.col('id')), 'count']],
            group: ['status'],
            raw: true,
        });
        return results.reduce((acc, curr) => {
            acc[curr.status] = parseInt(curr.count);
            return acc;
        }, {});
    }
    async search(query) {
        return await this.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    {
                        name: {
                            [sequelize_1.Op.iLike]: `%${query}%`,
                        },
                    },
                    {
                        description: {
                            [sequelize_1.Op.iLike]: `%${query}%`,
                        },
                    },
                ],
            },
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
            ],
        });
    }
    async findAllWithCounts(limit, offset) {
        // Simplified version for SQLite compatibility
        const result = await this.findAndCountAll({
            include: [
                {
                    model: Task_1.Task,
                    as: 'tasks',
                },
                {
                    model: GitHubRepo_1.GitHubRepo,
                    as: 'githubRepos',
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return result;
    }
}
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=ProjectRepository.js.map