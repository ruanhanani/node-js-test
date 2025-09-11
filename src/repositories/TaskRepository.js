"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const Task_1 = require("@models/Task");
const Project_1 = require("@models/Project");
class TaskRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Task_1.Task);
    }
    async findByProjectId(projectId) {
        return await this.findAll({
            where: {
                projectId,
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        });
    }
    async findWithProject(id) {
        return await this.findById(id, {
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
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
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        });
    }
    async findByPriority(priority) {
        return await this.findAll({
            where: {
                priority,
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['dueDate', 'ASC'], ['createdAt', 'DESC']],
        });
    }
    async findOverdueTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await this.findAll({
            where: {
                dueDate: {
                    [sequelize_1.Op.lt]: today,
                },
                status: {
                    [sequelize_1.Op.notIn]: ['completed', 'cancelled'],
                },
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['dueDate', 'ASC']],
        });
    }
    async findTasksDueIn(days) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        today.setHours(0, 0, 0, 0);
        futureDate.setHours(23, 59, 59, 999);
        return await this.findAll({
            where: {
                dueDate: {
                    [sequelize_1.Op.between]: [today, futureDate],
                },
                status: {
                    [sequelize_1.Op.notIn]: ['completed', 'cancelled'],
                },
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['dueDate', 'ASC'], ['priority', 'DESC']],
        });
    }
    async countByStatus(projectId) {
        const whereClause = {};
        if (projectId) {
            whereClause.projectId = projectId;
        }
        const results = await Task_1.Task.findAll({
            attributes: ['status', [Task_1.Task.sequelize.fn('COUNT', Task_1.Task.sequelize.col('id')), 'count']],
            where: whereClause,
            group: ['status'],
            raw: true,
        });
        return results.reduce((acc, curr) => {
            acc[curr.status] = parseInt(curr.count);
            return acc;
        }, {});
    }
    async countByPriority(projectId) {
        const whereClause = {};
        if (projectId) {
            whereClause.projectId = projectId;
        }
        const results = await Task_1.Task.findAll({
            attributes: ['priority', [Task_1.Task.sequelize.fn('COUNT', Task_1.Task.sequelize.col('id')), 'count']],
            where: whereClause,
            group: ['priority'],
            raw: true,
        });
        return results.reduce((acc, curr) => {
            acc[curr.priority] = parseInt(curr.count);
            return acc;
        }, {});
    }
    async search(query, projectId) {
        const whereClause = {
            [sequelize_1.Op.or]: [
                {
                    title: {
                        [sequelize_1.Op.iLike]: `%${query}%`,
                    },
                },
                {
                    description: {
                        [sequelize_1.Op.iLike]: `%${query}%`,
                    },
                },
            ],
        };
        if (projectId) {
            whereClause.projectId = projectId;
        }
        return await this.findAll({
            where: whereClause,
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        });
    }
    async findAllWithProject(projectId, limit, offset) {
        const whereClause = {};
        if (projectId) {
            whereClause.projectId = projectId;
        }
        return await this.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            limit,
            offset,
            order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        });
    }
    async findTasksForProject(projectId, filters) {
        const whereClause = { projectId };
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.priority) {
            whereClause.priority = filters.priority;
        }
        if (filters?.overdue) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            whereClause.dueDate = {
                [sequelize_1.Op.lt]: today,
            };
            whereClause.status = {
                [sequelize_1.Op.notIn]: ['completed', 'cancelled'],
            };
        }
        return await this.findAll({
            where: whereClause,
            order: [['priority', 'DESC'], ['dueDate', 'ASC'], ['createdAt', 'DESC']],
        });
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=TaskRepository.js.map