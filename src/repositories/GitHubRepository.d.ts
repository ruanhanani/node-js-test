import { BaseRepository } from './BaseRepository';
import { GitHubRepo } from '@models/GitHubRepo';
export interface IGitHubRepository {
    findByProjectAndUsername(projectId: number, username: string): Promise<GitHubRepo[]>;
    findByUsername(username: string): Promise<GitHubRepo[]>;
    findByProjectId(projectId: number): Promise<GitHubRepo[]>;
    findByGithubId(githubId: number): Promise<GitHubRepo | null>;
    bulkUpsert(repos: any[]): Promise<GitHubRepo[]>;
    deleteOldRepos(projectId: number, username: string, keepIds: number[]): Promise<number>;
}
export declare class GitHubRepository extends BaseRepository<GitHubRepo> implements IGitHubRepository {
    constructor();
    findByProjectAndUsername(projectId: number, username: string): Promise<GitHubRepo[]>;
    findByUsername(username: string): Promise<GitHubRepo[]>;
    findByProjectId(projectId: number): Promise<GitHubRepo[]>;
    findByGithubId(githubId: number): Promise<GitHubRepo | null>;
    bulkUpsert(repos: any[]): Promise<GitHubRepo[]>;
    deleteOldRepos(projectId: number, username: string, keepIds: number[]): Promise<number>;
    findRecentRepos(limit?: number): Promise<GitHubRepo[]>;
    findByLanguage(language: string): Promise<GitHubRepo[]>;
    findPopularRepos(minStars?: number): Promise<GitHubRepo[]>;
    getStatsByProject(projectId: number): Promise<{
        totalRepos: number;
        totalStars: number;
        totalForks: number;
        languages: {
            [key: string]: number;
        };
        lastUpdate: Date | null;
    }>;
    searchRepos(query: string, projectId?: number): Promise<GitHubRepo[]>;
}
//# sourceMappingURL=GitHubRepository.d.ts.map