"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const axios_1 = __importDefault(require("axios"));
const cache_mock_1 = require("@utils/cache-mock");
const GitHubRepository_1 = require("@repositories/GitHubRepository");
const ProjectRepository_1 = require("@repositories/ProjectRepository");
class GitHubService {
    constructor() {
        this.githubRepository = new GitHubRepository_1.GitHubRepository();
        this.projectRepository = new ProjectRepository_1.ProjectRepository();
        this.baseURL = process.env.GITHUB_API_URL || 'https://api.github.com';
    }
    async getUserRepositories(projectId, username) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        const cacheKey = cache_mock_1.cacheManager.generateKey('github', projectId, username);
        try {
            const result = await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
                console.log(`🐙 Fetching repositories for user: ${username}`);
                const githubRepos = await this.fetchFromGitHubAPI(username);
                const repoData = githubRepos.map(repo => ({
                    githubId: repo.id,
                    name: repo.name,
                    fullName: repo.full_name,
                    description: repo.description,
                    htmlUrl: repo.html_url,
                    cloneUrl: repo.clone_url,
                    language: repo.language,
                    stargazersCount: repo.stargazers_count,
                    forksCount: repo.forks_count,
                    private: repo.private,
                    username: repo.owner.login,
                    githubCreatedAt: new Date(repo.created_at),
                    githubUpdatedAt: new Date(repo.updated_at),
                    projectId,
                }));
                await this.saveRepositoriesToDatabase(projectId, username, repoData);
                return {
                    repositories: repoData,
                    fetchedAt: new Date(),
                };
            }, 600);
            const ttl = await cache_mock_1.cacheManager.getTTL(cacheKey);
            return {
                project: project.toJSON(),
                repositories: result.repositories,
                cached: ttl > 0,
                cacheExpiry: ttl > 0 ? ttl : undefined,
            };
        }
        catch (error) {
            console.error(`❌ Error fetching GitHub repositories for ${username}:`, error);
            const cachedRepos = await this.githubRepository.findByProjectAndUsername(projectId, username);
            return {
                project: project.toJSON(),
                repositories: cachedRepos.map(repo => repo.toJSON()),
                cached: true,
                cacheExpiry: undefined,
            };
        }
    }
    async fetchFromGitHubAPI(username) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/users/${username}/repos`, {
                params: {
                    per_page: 5,
                    sort: 'updated',
                    direction: 'desc',
                    type: 'public',
                },
                timeout: 5000,
                headers: {
                    'User-Agent': 'Node.js Test API',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });
            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from GitHub API');
            }
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message;
                switch (status) {
                    case 404:
                        throw new Error(`GitHub user '${username}' not found`);
                    case 403:
                        throw new Error('GitHub API rate limit exceeded. Please try again later.');
                    case 401:
                        throw new Error('GitHub API authentication failed');
                    default:
                        throw new Error(message || `GitHub API request failed: ${error.message}`);
                }
            }
            throw new Error(`Failed to fetch GitHub repositories: ${error.message}`);
        }
    }
    async saveRepositoriesToDatabase(projectId, username, repositories) {
        try {
            if (repositories.length === 0) {
                return;
            }
            await this.githubRepository.bulkUpsert(repositories);
            const currentGithubIds = repositories.map(repo => repo.githubId);
            await this.githubRepository.deleteOldRepos(projectId, username, currentGithubIds);
            console.log(`💾 Saved ${repositories.length} repositories for ${username} to database`);
        }
        catch (error) {
            console.error('❌ Error saving repositories to database:', error);
        }
    }
    async getCachedRepositories(projectId, username) {
        const repos = await this.githubRepository.findByProjectAndUsername(projectId, username);
        return repos.map(repo => repo.toJSON());
    }
    async clearCache(projectId, username) {
        await cache_mock_1.cacheManager.invalidateGitHubCache(projectId, username);
    }
}
exports.GitHubService = GitHubService;
//# sourceMappingURL=GitHubService.js.map