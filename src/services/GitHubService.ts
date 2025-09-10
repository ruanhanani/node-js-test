import axios from 'axios';
import { cacheManager } from '@utils/cache-mock';
import { GitHubRepository } from '@repositories/GitHubRepository';
import { ProjectRepository } from '@repositories/ProjectRepository';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface GitHubApiResponse {
  message?: string;
  documentation_url?: string;
}

export class GitHubService {
  private githubRepository: GitHubRepository;
  private projectRepository: ProjectRepository;
  private baseURL: string;

  constructor() {
    this.githubRepository = new GitHubRepository();
    this.projectRepository = new ProjectRepository();
    this.baseURL = process.env.GITHUB_API_URL || 'https://api.github.com';
  }

  async getUserRepositories(projectId: number, username: string): Promise<{
    project: any;
    repositories: any[];
    cached: boolean;
    cacheExpiry?: number;
  }> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const cacheKey = cacheManager.generateKey('github', projectId, username);
    
    try {
      const result = await cacheManager.getOrSet(
        cacheKey,
        async () => {
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
        },
        600
      );

      const ttl = await cacheManager.getTTL(cacheKey);
      
      return {
        project: project.toJSON(),
        repositories: result.repositories,
        cached: ttl > 0,
        cacheExpiry: ttl > 0 ? ttl : undefined,
      };
    } catch (error) {
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

  private async fetchFromGitHubAPI(username: string): Promise<GitHubRepo[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/${username}/repos`,
        {
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
        }
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format from GitHub API');
      }

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
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

  private async saveRepositoriesToDatabase(projectId: number, username: string, repositories: any[]): Promise<void> {
    try {
      if (repositories.length === 0) {
        return;
      }
      await this.githubRepository.bulkUpsert(repositories);
      const currentGithubIds = repositories.map(repo => repo.githubId);
      await this.githubRepository.deleteOldRepos(projectId, username, currentGithubIds);
      console.log(`💾 Saved ${repositories.length} repositories for ${username} to database`);
    } catch (error) {
      console.error('❌ Error saving repositories to database:', error);
    }
  }

  async getCachedRepositories(projectId: number, username: string): Promise<any[]> {
    const repos = await this.githubRepository.findByProjectAndUsername(projectId, username);
    return repos.map(repo => repo.toJSON());
  }

  async clearCache(projectId: number, username?: string): Promise<void> {
    await cacheManager.invalidateGitHubCache(projectId, username);
  }
}
