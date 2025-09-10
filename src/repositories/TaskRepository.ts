import { Op, WhereOptions } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { Task } from '@models/Task';
import { Project } from '@models/Project';

export interface ITaskRepository {
  findByProjectId(projectId: number): Promise<Task[]>;
  findWithProject(id: number): Promise<Task | null>;
  findByStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task[]>;
  findByPriority(priority: 'low' | 'medium' | 'high' | 'critical'): Promise<Task[]>;
  findOverdueTasks(): Promise<Task[]>;
  findTasksDueIn(days: number): Promise<Task[]>;
  countByStatus(projectId?: number): Promise<{ [key: string]: number }>;
  countByPriority(projectId?: number): Promise<{ [key: string]: number }>;
  search(query: string, projectId?: number): Promise<Task[]>;
}

export class TaskRepository extends BaseRepository<Task> implements ITaskRepository {
  constructor() {
    super(Task);
  }

  async findByProjectId(projectId: number): Promise<Task[]> {
    return await this.findAll({
      where: {
        projectId,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async findWithProject(id: number): Promise<Task | null> {
    return await this.findById(id, {
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
    });
  }

  async findByStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task[]> {
    return await this.findAll({
      where: {
        status,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async findByPriority(priority: 'low' | 'medium' | 'high' | 'critical'): Promise<Task[]> {
    return await this.findAll({
      where: {
        priority,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']],
    });
  }

  async findOverdueTasks(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.findAll({
      where: {
        dueDate: {
          [Op.lt]: today,
        },
        status: {
          [Op.notIn]: ['completed', 'cancelled'],
        },
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
  }

  async findTasksDueIn(days: number): Promise<Task[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    today.setHours(0, 0, 0, 0);
    futureDate.setHours(23, 59, 59, 999);

    return await this.findAll({
      where: {
        dueDate: {
          [Op.between]: [today, futureDate],
        },
        status: {
          [Op.notIn]: ['completed', 'cancelled'],
        },
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['dueDate', 'ASC'], ['priority', 'DESC']],
    });
  }

  async countByStatus(projectId?: number): Promise<{ [key: string]: number }> {
    const whereClause: WhereOptions = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const results = await Task.findAll({
      attributes: ['status', [Task.sequelize!.fn('COUNT', Task.sequelize!.col('id')), 'count']],
      where: whereClause,
      group: ['status'],
      raw: true,
    });

    return results.reduce((acc: { [key: string]: number }, curr: any) => {
      acc[curr.status] = parseInt(curr.count);
      return acc;
    }, {});
  }

  async countByPriority(projectId?: number): Promise<{ [key: string]: number }> {
    const whereClause: WhereOptions = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const results = await Task.findAll({
      attributes: ['priority', [Task.sequelize!.fn('COUNT', Task.sequelize!.col('id')), 'count']],
      where: whereClause,
      group: ['priority'],
      raw: true,
    });

    return results.reduce((acc: { [key: string]: number }, curr: any) => {
      acc[curr.priority] = parseInt(curr.count);
      return acc;
    }, {});
  }

  async search(query: string, projectId?: number): Promise<Task[]> {
    const whereClause: any = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${query}%`,
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
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async findAllWithProject(projectId?: number, limit?: number, offset?: number): Promise<{ rows: Task[]; count: number }> {
    const whereClause: WhereOptions = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    return await this.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      limit,
      offset,
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  async findTasksForProject(projectId: number, filters?: {
    status?: string;
    priority?: string;
    overdue?: boolean;
  }): Promise<Task[]> {
    const whereClause: WhereOptions = { projectId };

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
        [Op.lt]: today,
      };
      whereClause.status = {
        [Op.notIn]: ['completed', 'cancelled'],
      };
    }

    return await this.findAll({
      where: whereClause,
      order: [['priority', 'DESC'], ['dueDate', 'ASC'], ['createdAt', 'DESC']],
    });
  }
}
