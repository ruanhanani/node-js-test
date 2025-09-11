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
exports.Task = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Project_1 = require("./Project");
let Task = class Task extends sequelize_typescript_1.Model {
    // Instance methods
    toJSON() {
        const values = super.toJSON();
        return {
            ...values,
            isOverdue: this.dueDate ? new Date() > new Date(this.dueDate) : false,
            daysUntilDue: this.dueDate
                ? Math.ceil((new Date(this.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null,
        };
    }
};
exports.Task = Task;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Título da tarefa é obrigatório',
            },
            len: {
                args: [2, 255],
                msg: 'Título da tarefa deve ter entre 2 e 255 caracteres',
            },
        },
    }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
    }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Project_1.Project),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'ID do projeto é obrigatório',
            },
        },
    }),
    __metadata("design:type", Number)
], Task.prototype, "projectId", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Project_1.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Project_1.Project)
], Task.prototype, "project", void 0);
exports.Task = Task = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'tasks',
        timestamps: true,
    })
], Task);
//# sourceMappingURL=Task.js.map