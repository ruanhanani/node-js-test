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
export declare class GitHubService {
    private githubRepository;
    private projectRepository;
    private baseURL;
    constructor();
    getUserRepositories(projectId: number, username: string): Promise<{
        project: any;
        repositories: any[];
        cached: boolean;
        cacheExpiry?: number;
    }>;
    private fetchFromGitHubAPI;
    private saveRepositoriesToDatabase;
    getCachedRepositories(projectId: number, username: string): Promise<any[]>;
    clearCache(projectId: number, username?: string): Promise<void>;
}
//# sourceMappingURL=GitHubService.d.ts.map