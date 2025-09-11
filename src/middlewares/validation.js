"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearch = exports.validateParams = exports.validateTask = exports.validateProject = exports.validate = exports.paramSchemas = exports.taskSchemas = exports.projectSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
// Project validation schemas
exports.projectSchemas = {
    create: joi_1.default.object({
        name: joi_1.default.string().min(2).max(255).required().messages({
            'string.empty': 'Nome do projeto é obrigatório',
            'string.min': 'Nome do projeto deve ter pelo menos 2 caracteres',
            'string.max': 'Nome do projeto deve ter no máximo 255 caracteres',
            'any.required': 'Nome do projeto é obrigatório',
        }),
        description: joi_1.default.string().max(5000).optional().allow('').messages({
            'string.max': 'Descrição do projeto deve ter no máximo 5000 caracteres',
        }),
        status: joi_1.default.string().valid('active', 'inactive', 'completed').default('active').messages({
            'any.only': 'Status deve ser: active, inactive ou completed',
        }),
        startDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
        }),
        endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).optional().messages({
            'date.format': 'Data de fim deve estar no formato ISO (YYYY-MM-DD)',
            'date.min': 'Data de fim deve ser posterior à data de início',
        }),
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(2).max(255).optional().messages({
            'string.min': 'Nome do projeto deve ter pelo menos 2 caracteres',
            'string.max': 'Nome do projeto deve ter no máximo 255 caracteres',
        }),
        description: joi_1.default.string().max(5000).optional().allow('').messages({
            'string.max': 'Descrição do projeto deve ter no máximo 5000 caracteres',
        }),
        status: joi_1.default.string().valid('active', 'inactive', 'completed').optional().messages({
            'any.only': 'Status deve ser: active, inactive ou completed',
        }),
        startDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
        }),
        endDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de fim deve estar no formato ISO (YYYY-MM-DD)',
        }),
    }).custom((value, helpers) => {
        if (value.startDate && value.endDate && value.startDate > value.endDate) {
            return helpers.error('custom.dateRange');
        }
        return value;
    }).messages({
        'custom.dateRange': 'Data de fim deve ser posterior à data de início',
    }),
    query: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1).messages({
            'number.base': 'Página deve ser um número',
            'number.integer': 'Página deve ser um número inteiro',
            'number.min': 'Página deve ser maior que 0',
        }),
        limit: joi_1.default.number().integer().min(1).max(100).default(10).messages({
            'number.base': 'Limite deve ser um número',
            'number.integer': 'Limite deve ser um número inteiro',
            'number.min': 'Limite deve ser maior que 0',
            'number.max': 'Limite deve ser menor que 100',
        }),
        status: joi_1.default.string().valid('active', 'inactive', 'completed').optional().messages({
            'any.only': 'Status deve ser: active, inactive ou completed',
        }),
        search: joi_1.default.string().min(2).max(255).optional().messages({
            'string.min': 'Busca deve ter pelo menos 2 caracteres',
            'string.max': 'Busca deve ter no máximo 255 caracteres',
        }),
        startDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
        }),
        endDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de fim deve estar no formato ISO (YYYY-MM-DD)',
        }),
    }),
};
// Task validation schemas
exports.taskSchemas = {
    create: joi_1.default.object({
        title: joi_1.default.string().min(2).max(255).required().messages({
            'string.empty': 'Título da tarefa é obrigatório',
            'string.min': 'Título da tarefa deve ter pelo menos 2 caracteres',
            'string.max': 'Título da tarefa deve ter no máximo 255 caracteres',
            'any.required': 'Título da tarefa é obrigatório',
        }),
        description: joi_1.default.string().max(5000).optional().allow('').messages({
            'string.max': 'Descrição da tarefa deve ter no máximo 5000 caracteres',
        }),
        status: joi_1.default.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending').messages({
            'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
        }),
        priority: joi_1.default.string().valid('low', 'medium', 'high', 'critical').default('medium').messages({
            'any.only': 'Prioridade deve ser: low, medium, high ou critical',
        }),
        dueDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de vencimento deve estar no formato ISO (YYYY-MM-DD)',
        }),
    }),
    update: joi_1.default.object({
        title: joi_1.default.string().min(2).max(255).optional().messages({
            'string.min': 'Título da tarefa deve ter pelo menos 2 caracteres',
            'string.max': 'Título da tarefa deve ter no máximo 255 caracteres',
        }),
        description: joi_1.default.string().max(5000).optional().allow('').messages({
            'string.max': 'Descrição da tarefa deve ter no máximo 5000 caracteres',
        }),
        status: joi_1.default.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().messages({
            'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
        }),
        priority: joi_1.default.string().valid('low', 'medium', 'high', 'critical').optional().messages({
            'any.only': 'Prioridade deve ser: low, medium, high ou critical',
        }),
        dueDate: joi_1.default.date().iso().optional().messages({
            'date.format': 'Data de vencimento deve estar no formato ISO (YYYY-MM-DD)',
        }),
    }),
    query: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1).messages({
            'number.base': 'Página deve ser um número',
            'number.integer': 'Página deve ser um número inteiro',
            'number.min': 'Página deve ser maior que 0',
        }),
        limit: joi_1.default.number().integer().min(1).max(100).default(10).messages({
            'number.base': 'Limite deve ser um número',
            'number.integer': 'Limite deve ser um número inteiro',
            'number.min': 'Limite deve ser maior que 0',
            'number.max': 'Limite deve ser menor que 100',
        }),
        status: joi_1.default.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().messages({
            'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
        }),
        priority: joi_1.default.string().valid('low', 'medium', 'high', 'critical').optional().messages({
            'any.only': 'Prioridade deve ser: low, medium, high ou critical',
        }),
        projectId: joi_1.default.number().integer().min(1).optional().messages({
            'number.base': 'ID do projeto deve ser um número',
            'number.integer': 'ID do projeto deve ser um número inteiro',
            'number.min': 'ID do projeto deve ser maior que 0',
        }),
        overdue: joi_1.default.boolean().optional().messages({
            'boolean.base': 'Overdue deve ser um valor booleano',
        }),
        dueInDays: joi_1.default.number().integer().min(0).max(365).optional().messages({
            'number.base': 'Dias deve ser um número',
            'number.integer': 'Dias deve ser um número inteiro',
            'number.min': 'Dias deve ser maior ou igual a 0',
            'number.max': 'Dias deve ser menor que 365',
        }),
        search: joi_1.default.string().min(2).max(255).optional().messages({
            'string.min': 'Busca deve ter pelo menos 2 caracteres',
            'string.max': 'Busca deve ter no máximo 255 caracteres',
        }),
    }),
};
// Parameter validation schemas
exports.paramSchemas = {
    id: joi_1.default.object({
        id: joi_1.default.number().integer().min(1).required().messages({
            'number.base': 'ID deve ser um número',
            'number.integer': 'ID deve ser um número inteiro',
            'number.min': 'ID deve ser maior que 0',
            'any.required': 'ID é obrigatório',
        }),
    }),
    projectId: joi_1.default.object({
        projectId: joi_1.default.number().integer().min(1).required().messages({
            'number.base': 'ID do projeto deve ser um número',
            'number.integer': 'ID do projeto deve ser um número inteiro',
            'number.min': 'ID do projeto deve ser maior que 0',
            'any.required': 'ID do projeto é obrigatório',
        }),
    }),
    github: joi_1.default.object({
        id: joi_1.default.number().integer().min(1).required().messages({
            'number.base': 'ID do projeto deve ser um número',
            'number.integer': 'ID do projeto deve ser um número inteiro',
            'number.min': 'ID do projeto deve ser maior que 0',
            'any.required': 'ID do projeto é obrigatório',
        }),
        username: joi_1.default.string().min(1).max(39).pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i).required().messages({
            'string.empty': 'Nome de usuário do GitHub é obrigatório',
            'string.min': 'Nome de usuário do GitHub deve ter pelo menos 1 caractere',
            'string.max': 'Nome de usuário do GitHub deve ter no máximo 39 caracteres',
            'string.pattern.base': 'Nome de usuário do GitHub tem formato inválido',
            'any.required': 'Nome de usuário do GitHub é obrigatório',
        }),
    }),
};
// Generic validation middleware factory
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));
            return res.status(400).json({
                success: false,
                message: 'Dados de entrada inválidos',
                errors,
            });
        }
        // Replace the request property with the validated and cleaned data
        if (property === 'query') {
            Object.assign(req.query, value);
        }
        else if (property === 'body') {
            req.body = value;
        }
        else if (property === 'params') {
            Object.assign(req.params, value);
        }
        next();
    };
};
exports.validate = validate;
// Specific validation middlewares
exports.validateProject = {
    create: (0, exports.validate)(exports.projectSchemas.create, 'body'),
    update: (0, exports.validate)(exports.projectSchemas.update, 'body'),
    query: (0, exports.validate)(exports.projectSchemas.query, 'query'),
};
exports.validateTask = {
    create: (0, exports.validate)(exports.taskSchemas.create, 'body'),
    update: (0, exports.validate)(exports.taskSchemas.update, 'body'),
    query: (0, exports.validate)(exports.taskSchemas.query, 'query'),
};
exports.validateParams = {
    id: (0, exports.validate)(exports.paramSchemas.id, 'params'),
    projectId: (0, exports.validate)(exports.paramSchemas.projectId, 'params'),
    github: (0, exports.validate)(exports.paramSchemas.github, 'params'),
};
// Search validation
exports.validateSearch = (0, exports.validate)(joi_1.default.object({
    q: joi_1.default.string().min(2).max(255).required().messages({
        'string.empty': 'Termo de busca é obrigatório',
        'string.min': 'Termo de busca deve ter pelo menos 2 caracteres',
        'string.max': 'Termo de busca deve ter no máximo 255 caracteres',
        'any.required': 'Termo de busca é obrigatório',
    }),
    projectId: joi_1.default.number().integer().min(1).optional().messages({
        'number.base': 'ID do projeto deve ser um número',
        'number.integer': 'ID do projeto deve ser um número inteiro',
        'number.min': 'ID do projeto deve ser maior que 0',
    }),
}), 'query');
//# sourceMappingURL=validation.js.map