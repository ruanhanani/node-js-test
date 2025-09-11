import { Op, WhereOptions } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { Project } from '@models/Project';
import { Task } from '@models/Task';
import { GitHubRepo } from '@models/GitHubRepo';

export interface IProjectRepository {
  findWithTasks(id: number): Promise<Project | null>;
  findWithGithubRepos(id: number): Promise<Project | null>;
  findWithTasksAndRepos(id: number): Promise<Project | null>;
  findByStatus(status: 'active' | 'inactive' | 'completed'): Promise<Project[]>;
  findActiveProjects(): Promise<Project[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Project[]>;
  countByStatus(): Promise<{ [key: string]: number }>;
  search(query: string): Promise<Project[]>;
}

export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
  constructor() {
    super(Project);
  }

  async findWithTasks(id: number): Promise<Project | null> {
    return await this.findById(id, {
      include: [
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });
  }

  async findWithGithubRepos(id: number): Promise<Project | null> {
    return await this.findById(id, {
      include: [
        {
          model: GitHubRepo,
          as: 'githubRepos',
        },
      ],
    });
  }

  async findWithTasksAndRepos(id: number): Promise<Project | null> {
    return await this.findById(id, {
      include: [
        {
          model: Task,
          as: 'tasks',
        },
        {
          model: GitHubRepo,
          as: 'githubRepos',
        },
      ],
    });
  }

  async findByStatus(status: 'active' | 'inactive' | 'completed'): Promise<Project[]> {
    return await this.findAll({
      where: {
        status,
      } as WhereOptions,
      include: [
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });
  }

  async findActiveProjects(): Promise<Project[]> {
    return await this.findByStatus('active');
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Project[]> {
    return await this.findAll({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              {
                startDate: {
                  [Op.lte]: startDate,
                },
              },
              {
                endDate: {
                  [Op.gte]: endDate,
                },
              },
            ],
          },
        ],
      } as WhereOptions,
      include: [
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });
  }

  async countByStatus(): Promise<{ [key: string]: number }> {
    const results = await Project.findAll({
      attributes: ['status', [Project.sequelize!.fn('COUNT', Project.sequelize!.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    return results.reduce((acc: { [key: string]: number }, curr: any) => {
      acc[curr.status] = parseInt(curr.count);
      return acc;
    }, {});
  }

  async search(query: string): Promise<Project[]> {
    return await this.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      } as WhereOptions,
      include: [
        {
          model: Task,
          as: 'tasks',
        },
      ],
    });
  }

  async findAllWithCounts(limit?: number, offset?: number): Promise<{ rows: Project[]; count: number }> {
    const options: any = {
      include: [
        {
          model: Task,
          as: 'tasks',
        },
        {
          model: GitHubRepo,
          as: 'githubRepos',
        },
      ],
      order: [['createdAt', 'DESC']],
    };

    if (limit !== undefined && limit !== null) {
      const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        options.limit = limitNum;
      }
    }
    if (offset !== undefined && offset !== null) {
      const offsetNum = typeof offset === 'string' ? parseInt(offset, 10) : Number(offset);
      if (!isNaN(offsetNum) && offsetNum >= 0) {
        options.offset = offsetNum;
      }
    }

    return await this.findAndCountAll(options);
  }
}
