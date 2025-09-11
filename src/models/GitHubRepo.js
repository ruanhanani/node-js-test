"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubRepo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Project_1 = require("./Project");
let GitHubRepo = class GitHubRepo extends sequelize_typescript_1.Model {
    // Instance methods
    toJSON() {
        const values = super.toJSON();
        return {
            ...values,
            isRecentlyUpdated: this.githubUpdatedAt
                ? (new Date().getTime() - new Date(this.githubUpdatedAt).getTime()) / (1000 * 60 * 60 * 24) < 30
                : false,
            daysSinceLastUpdate: this.githubUpdatedAt
                ? Math.floor((new Date().getTime() - new Date(this.githubUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))
                : null,
        };
    }
};
exports.GitHubRepo = GitHubRepo;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], GitHubRepo.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", Number)
], GitHubRepo.prototype, "githubId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "htmlUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "cloneUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "language", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], GitHubRepo.prototype, "stargazersCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], GitHubRepo.prototype, "forksCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], GitHubRepo.prototype, "private", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GitHubRepo.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GitHubRepo.prototype, "githubCreatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GitHubRepo.prototype, "githubUpdatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Project_1.Project),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GitHubRepo.prototype, "projectId", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GitHubRepo.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GitHubRepo.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Project_1.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Project_1.Project)
], GitHubRepo.prototype, "project", void 0);
exports.GitHubRepo = GitHubRepo = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'github_repos',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['githubId'],
            },
            {
                fields: ['username', 'projectId'],
            },
        ],
    })
], GitHubRepo);
//# sourceMappingURL=GitHubRepo.js.map