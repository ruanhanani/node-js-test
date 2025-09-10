import { Op, WhereOptions } from 'sequelize';
import { BaseRepository } from './BaseRepository';
import { GitHubRepo } from '@models/GitHubRepo';
import { Project } from '@models/Project';

export interface IGitHubRepository {
  findByProjectAndUsername(projectId: number, username: string): Promise<GitHubRepo[]>;
  findByUsername(username: string): Promise<GitHubRepo[]>;
  findByProjectId(projectId: number): Promise<GitHubRepo[]>;
  findByGithubId(githubId: number): Promise<GitHubRepo | null>;
  bulkUpsert(repos: any[]): Promise<GitHubRepo[]>;
  deleteOldRepos(projectId: number, username: string, keepIds: number[]): Promise<number>;
}

export class GitHubRepository extends BaseRepository<GitHubRepo> implements IGitHubRepository {
  constructor() {
    super(GitHubRepo);
  }

  async findByProjectAndUsername(projectId: number, username: string): Promise<GitHubRepo[]> {
    return await this.findAll({
      where: {
        projectId,
        username,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['githubUpdatedAt', 'DESC']],
    });
  }

  async findByUsername(username: string): Promise<GitHubRepo[]> {
    return await this.findAll({
      where: {
        username,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['githubUpdatedAt', 'DESC']],
    });
  }

  async findByProjectId(projectId: number): Promise<GitHubRepo[]> {
    return await this.findAll({
      where: {
        projectId,
      } as WhereOptions,
      order: [['githubUpdatedAt', 'DESC']],
    });
  }

  async findByGithubId(githubId: number): Promise<GitHubRepo | null> {
    return await this.findOne({
      where: {
        githubId,
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
    });
  }

  async bulkUpsert(repos: any[]): Promise<GitHubRepo[]> {
    const results: GitHubRepo[] = [];

    for (const repo of repos) {
      const [instance, created] = await GitHubRepo.findOrCreate({
        where: { githubId: repo.githubId },
        defaults: repo,
      });

      if (!created) {
        await instance.update(repo);
      }

      results.push(instance);
    }

    return results;
  }

  async deleteOldRepos(projectId: number, username: string, keepIds: number[]): Promise<number> {
    return await this.model.destroy({
      where: {
        projectId,
        username,
        githubId: {
          [Op.notIn]: keepIds,
        },
      } as WhereOptions,
    });
  }

  async findRecentRepos(limit: number = 10): Promise<GitHubRepo[]> {
    return await this.findAll({
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['githubUpdatedAt', 'DESC']],
      limit,
    });
  }

  async findByLanguage(language: string): Promise<GitHubRepo[]> {
    return await this.findAll({
      where: {
        language: {
          [Op.iLike]: `%${language}%`,
        },
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['stargazersCount', 'DESC'], ['githubUpdatedAt', 'DESC']],
    });
  }

  async findPopularRepos(minStars: number = 1): Promise<GitHubRepo[]> {
    return await this.findAll({
      where: {
        stargazersCount: {
          [Op.gte]: minStars,
        },
      } as WhereOptions,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['stargazersCount', 'DESC'], ['forksCount', 'DESC']],
    });
  }

  async getStatsByProject(projectId: number): Promise<{
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    languages: { [key: string]: number };
    lastUpdate: Date | null;
  }> {
    const repos = await this.findByProjectId(projectId);

    const stats = repos.reduce(
      (acc, repo) => {
        acc.totalStars += repo.stargazersCount;
        acc.totalForks += repo.forksCount;

        if (repo.language) {
          acc.languages[repo.language] = (acc.languages[repo.language] || 0) + 1;
        }

        if (!acc.lastUpdate || repo.githubUpdatedAt > acc.lastUpdate) {
          acc.lastUpdate = repo.githubUpdatedAt;
        }

        return acc;
      },
      {
        totalRepos: repos.length,
        totalStars: 0,
        totalForks: 0,
        languages: {} as { [key: string]: number },
        lastUpdate: null as Date | null,
      }
    );

    return stats;
  }

  async searchRepos(query: string, projectId?: number): Promise<GitHubRepo[]> {
    const whereClause: any = {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          language: {
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
      order: [['stargazersCount', 'DESC'], ['githubUpdatedAt', 'DESC']],
    });
  }
}
