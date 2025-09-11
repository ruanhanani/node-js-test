"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubRepository = void 0;
const sequelize_1 = require("sequelize");
const BaseRepository_1 = require("./BaseRepository");
const GitHubRepo_1 = require("@models/GitHubRepo");
const Project_1 = require("@models/Project");
class GitHubRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(GitHubRepo_1.GitHubRepo);
    }
    async findByProjectAndUsername(projectId, username) {
        return await this.findAll({
            where: {
                projectId,
                username,
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['githubUpdatedAt', 'DESC']],
        });
    }
    async findByUsername(username) {
        return await this.findAll({
            where: {
                username,
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['githubUpdatedAt', 'DESC']],
        });
    }
    async findByProjectId(projectId) {
        return await this.findAll({
            where: {
                projectId,
            },
            order: [['githubUpdatedAt', 'DESC']],
        });
    }
    async findByGithubId(githubId) {
        return await this.findOne({
            where: {
                githubId,
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
        });
    }
    async bulkUpsert(repos) {
        const results = [];
        for (const repo of repos) {
            const [instance, created] = await GitHubRepo_1.GitHubRepo.findOrCreate({
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
    async deleteOldRepos(projectId, username, keepIds) {
        return await this.model.destroy({
            where: {
                projectId,
                username,
                githubId: {
                    [sequelize_1.Op.notIn]: keepIds,
                },
            },
        });
    }
    async findRecentRepos(limit = 10) {
        return await this.findAll({
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['githubUpdatedAt', 'DESC']],
            limit,
        });
    }
    async findByLanguage(language) {
        return await this.findAll({
            where: {
                language: {
                    [sequelize_1.Op.iLike]: `%${language}%`,
                },
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['stargazersCount', 'DESC'], ['githubUpdatedAt', 'DESC']],
        });
    }
    async findPopularRepos(minStars = 1) {
        return await this.findAll({
            where: {
                stargazersCount: {
                    [sequelize_1.Op.gte]: minStars,
                },
            },
            include: [
                {
                    model: Project_1.Project,
                    as: 'project',
                    attributes: ['id', 'name', 'status'],
                },
            ],
            order: [['stargazersCount', 'DESC'], ['forksCount', 'DESC']],
        });
    }
    async getStatsByProject(projectId) {
        const repos = await this.findByProjectId(projectId);
        const stats = repos.reduce((acc, repo) => {
            acc.totalStars += repo.stargazersCount;
            acc.totalForks += repo.forksCount;
            if (repo.language) {
                acc.languages[repo.language] = (acc.languages[repo.language] || 0) + 1;
            }
            if (!acc.lastUpdate || repo.githubUpdatedAt > acc.lastUpdate) {
                acc.lastUpdate = repo.githubUpdatedAt;
            }
            return acc;
        }, {
            totalRepos: repos.length,
            totalStars: 0,
            totalForks: 0,
            languages: {},
            lastUpdate: null,
        });
        return stats;
    }
    async searchRepos(query, projectId) {
        const whereClause = {
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
                {
                    language: {
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
            order: [['stargazersCount', 'DESC'], ['githubUpdatedAt', 'DESC']],
        });
    }
}
exports.GitHubRepository = GitHubRepository;
//# sourceMappingURL=GitHubRepository.js.map