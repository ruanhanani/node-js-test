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
exports.Project = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Task_1 = require("./Task");
const GitHubRepo_1 = require("./GitHubRepo");
let Project = class Project extends sequelize_typescript_1.Model {
    // Instance methods
    toJSON() {
        const values = super.toJSON();
        return {
            ...values,
            tasksCount: this.tasks?.length || 0,
            githubReposCount: this.githubRepos?.length || 0,
        };
    }
};
exports.Project = Project;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Nome do projeto é obrigatório',
            },
            len: {
                args: [2, 255],
                msg: 'Nome do projeto deve ter entre 2 e 255 caracteres',
            },
        },
    }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('active', 'inactive', 'completed'),
        allowNull: false,
        defaultValue: 'active',
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Project.prototype, "endDate", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Task_1.Task, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
        hooks: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => GitHubRepo_1.GitHubRepo, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
        hooks: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "githubRepos", void 0);
exports.Project = Project = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'projects',
        timestamps: true,
    })
], Project);
//# sourceMappingURL=Project.js.map