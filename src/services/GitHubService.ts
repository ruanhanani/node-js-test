import axios from 'axios';
import https from 'https';
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
  private githubToken?: string;

  constructor() {
    this.githubRepository = new GitHubRepository();
    this.projectRepository = new ProjectRepository();
    this.baseURL = process.env.GITHUB_API_URL || 'https://api.github.com';
    this.githubToken = process.env.GITHUB_TOKEN;
    
    // Configure HTTPS agent to handle corporate proxy/SSL issues
    axios.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Bypass self-signed certificate issues
    });
    
    console.log(`🔒 [GitHubService] Configured SSL certificate bypass for corporate environments`);
    
    if (this.githubToken) {
      console.log(`🔑 [GitHubService] GitHub token configured - increased rate limits available`);
    } else {
      console.log(`⚠️ [GitHubService] No GitHub token - using anonymous requests (60 requests/hour limit)`);
    }
  }

  async getUserRepositories(projectId: number, username: string): Promise<{
    project: any;
    repositories: any[];
    cached: boolean;
    cacheExpiry?: number;
  }> {
    console.log(`🔍 [GitHubService] Starting FRESH getUserRepositories for projectId: ${projectId}, username: ${username}`);
    
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    try {
      console.log(`🐙 [GitHubService] Making DIRECT call to GitHub API for user: ${username}`);
      
      const githubRepos = await this.fetchFromGitHubAPI(username);
      console.log(`📊 [GitHubService] ✅ GitHub API SUCCESS! Returned ${githubRepos.length} repositories for ${username}`);
      
      if (githubRepos.length > 0) {
        console.log(`🔍 [GitHubService] First repo sample:`, {
          name: githubRepos[0].name,
          full_name: githubRepos[0].full_name,
          stars: githubRepos[0].stargazers_count
        });
      }
      
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

      console.log(`🔧 [GitHubService] ✅ Successfully mapped ${repoData.length} repositories`);
      console.log(`💾 [GitHubService] Saving repositories to database...`);
      await this.saveRepositoriesToDatabase(projectId, username, repoData);
      
      return {
        project: project.toJSON(),
        repositories: repoData,
        cached: false,
        cacheExpiry: undefined,
      };
    } catch (error) {
      console.error(`❌ [GitHubService] ERROR in getUserRepositories for ${username}:`, error);
      console.error(`❌ [GitHubService] Error details:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown'
      });
      
      // Fallback to database
      console.log(`🔄 [GitHubService] Attempting fallback to database...`);
      const cachedRepos = await this.githubRepository.findByProjectAndUsername(projectId, username);
      console.log(`📊 [GitHubService] Database fallback: Found ${cachedRepos.length} cached repositories`);
      
      return {
        project: project.toJSON(),
        repositories: cachedRepos.map(repo => repo.toJSON()),
        cached: true,
        cacheExpiry: undefined,
      };
    }
  }

  private async fetchFromGitHubAPI(username: string): Promise<GitHubRepo[]> {
    console.log(`🌐 [GitHubService] 🔥 MAKING API REQUEST to GitHub for username: ${username}`);
    
    try {
      const url = `${this.baseURL}/users/${username}/repos`;
      console.log(`🔗 [GitHubService] 🚀 Request URL: ${url}`);
      
      const params = {
        per_page: 5,
        sort: 'updated',
        direction: 'desc',
        type: 'public',
      };
      
      console.log(`🔧 [GitHubService] Request params:`, params);
      
      const headers: any = {
        'User-Agent': 'Node.js-Test-API/1.0',
        'Accept': 'application/vnd.github.v3+json',
      };
      
      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
        console.log(`🔐 [GitHubService] Using authenticated request`);
      }
      
      console.log(`🚀 [GitHubService] Making request with headers:`, Object.keys(headers));
      
      const response = await axios.get(url, {
        params,
        timeout: 15000, // 15 second timeout
        headers,
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      });

      console.log(`✅ [GitHubService] 🎆 Response received! Status: ${response.status}`);
      console.log(`📊 [GitHubService] Rate limit info:`, {
        'limit': response.headers['x-ratelimit-limit'],
        'remaining': response.headers['x-ratelimit-remaining'],
        'reset': response.headers['x-ratelimit-reset']
      });
      
      // Handle different response statuses
      if (response.status === 404) {
        console.log(`🚫 [GitHubService] User '${username}' not found (404)`);
        return []; // Return empty array for non-existent users
      }
      
      if (response.status === 403) {
        const resetTime = response.headers['x-ratelimit-reset'];
        const remaining = response.headers['x-ratelimit-remaining'];
        console.error(`❌ [GitHubService] Rate limit exceeded! Remaining: ${remaining}, Reset: ${new Date(parseInt(resetTime) * 1000)}`);
        throw new Error(`GitHub API rate limit exceeded. Try again after ${new Date(parseInt(resetTime) * 1000).toLocaleTimeString()}`);
      }
      
      if (response.status >= 400) {
        console.error(`❌ [GitHubService] GitHub API error:`, {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      console.log(`📊 [GitHubService] Data type: ${typeof response.data}, isArray: ${Array.isArray(response.data)}`);
      
      if (!Array.isArray(response.data)) {
        console.error(`❌ [GitHubService] Invalid response format:`, typeof response.data);
        console.error(`❌ [GitHubService] Response data:`, response.data);
        throw new Error('GitHub API returned invalid data format');
      }

      console.log(`📈 [GitHubService] 🎉 FOUND ${response.data.length} repositories for ${username}`);
      
      if (response.data.length > 0) {
        console.log(`🔍 [GitHubService] 🥇 First repository:`, {
          name: response.data[0].name,
          full_name: response.data[0].full_name,
          stargazers_count: response.data[0].stargazers_count,
          language: response.data[0].language
        });
      } else {
        console.log(`🤔 [GitHubService] User ${username} has no public repositories`);
      }
      
      return response.data;
    } catch (error: any) {
      console.error(`💥 [GitHubService] ❗ ERROR in fetchFromGitHubAPI for ${username}:`);
      console.error(`💥 [GitHubService] Error type:`, error.constructor.name);
      console.error(`💥 [GitHubService] Error message:`, error.message);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        const message = error.response?.data?.message;
        const headers = error.response?.headers;
        
        console.error(`🚨 [GitHubService] Axios error details:`, {
          status,
          statusText,
          message,
          url: error.config?.url,
          timeout: error.config?.timeout,
          rateLimit: {
            limit: headers?.['x-ratelimit-limit'],
            remaining: headers?.['x-ratelimit-remaining'],
            reset: headers?.['x-ratelimit-reset']
          }
        });
        
        switch (status) {
          case 404:
            throw new Error(`GitHub user '${username}' not found`);
          case 403:
            console.error(`❌ [GitHubService] Rate limit or forbidden. Headers:`, headers);
            throw new Error('GitHub API rate limit exceeded or forbidden. Please try again later.');
          case 401:
            throw new Error('GitHub API authentication failed');
          default:
            throw new Error(message || `GitHub API request failed with status ${status}: ${error.message}`);
        }
      }
      
      console.error(`❌ [GitHubService] Non-Axios error:`, error);
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

  async flushAllCache(): Promise<void> {
    console.log(`🧽 [GitHubService] Flushing entire cache`);
    await cacheManager.flush();
  }

  /**
   * Create a GitHub repository manually in the database
   * @param projectId - Project ID to associate with
   * @param repositoryData - Repository data to create
   * @returns Created repository
   */
  async createRepository(projectId: number, repositoryData: any): Promise<any> {
    console.log(`📤 [GitHubService] Creating repository manually:`, {
      projectId,
      githubId: repositoryData.githubId,
      name: repositoryData.name,
      username: repositoryData.username
    });

    // Verify project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Check if repository with same githubId already exists for this project
    const existingRepo = await this.githubRepository.findByGithubIdAndProject(
      repositoryData.githubId,
      projectId
    );
    
    if (existingRepo) {
      throw new Error(`Repositório com githubId ${repositoryData.githubId} já existe neste projeto`);
    }

    // Create the repository
    const createdRepo = await this.githubRepository.create(repositoryData);
    console.log(`✅ [GitHubService] Repository created successfully with ID:`, createdRepo.id);

    // Clear cache to force refresh on next GET request
    await this.clearCache(projectId, repositoryData.username);

    return createdRepo.toJSON();
  }
}
