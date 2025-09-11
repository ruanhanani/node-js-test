import { Model } from 'sequelize-typescript';
import { Project } from './Project';
export declare class GitHubRepo extends Model {
    id: number;
    githubId: number;
    name: string;
    fullName: string;
    description?: string;
    htmlUrl: string;
    cloneUrl: string;
    language?: string;
    stargazersCount: number;
    forksCount: number;
    private: boolean;
    username: string;
    githubCreatedAt: Date;
    githubUpdatedAt: Date;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
    toJSON(): object;
}
//# sourceMappingURL=GitHubRepo.d.ts.map