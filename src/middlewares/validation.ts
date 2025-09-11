import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Project validation schemas
export const projectSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Nome do projeto é obrigatório',
      'string.min': 'Nome do projeto deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do projeto deve ter no máximo 255 caracteres',
      'any.required': 'Nome do projeto é obrigatório',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
      'string.max': 'Descrição do projeto deve ter no máximo 5000 caracteres',
    }),
    status: Joi.string().valid('active', 'inactive', 'completed').default('active').messages({
      'any.only': 'Status deve ser: active, inactive ou completed',
    }),
    startDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
      'date.format': 'Data de fim deve estar no formato ISO (YYYY-MM-DD)',
      'date.min': 'Data de fim deve ser posterior à data de início',
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Nome do projeto deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do projeto deve ter no máximo 255 caracteres',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
      'string.max': 'Descrição do projeto deve ter no máximo 5000 caracteres',
    }),
    status: Joi.string().valid('active', 'inactive', 'completed').optional().messages({
      'any.only': 'Status deve ser: active, inactive ou completed',
    }),
    startDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
    }),
    endDate: Joi.date().iso().optional().messages({
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

  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Página deve ser um número',
      'number.integer': 'Página deve ser um número inteiro',
      'number.min': 'Página deve ser maior que 0',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limite deve ser um número',
      'number.integer': 'Limite deve ser um número inteiro',
      'number.min': 'Limite deve ser maior que 0',
      'number.max': 'Limite deve ser menor que 100',
    }),
    status: Joi.string().valid('active', 'inactive', 'completed').optional().messages({
      'any.only': 'Status deve ser: active, inactive ou completed',
    }),
    search: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Busca deve ter pelo menos 2 caracteres',
      'string.max': 'Busca deve ter no máximo 255 caracteres',
    }),
    startDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de início deve estar no formato ISO (YYYY-MM-DD)',
    }),
    endDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de fim deve estar no formato ISO (YYYY-MM-DD)',
    }),
  }),
};

// Task validation schemas
export const taskSchemas = {
  create: Joi.object({
    title: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Título da tarefa é obrigatório',
      'string.min': 'Título da tarefa deve ter pelo menos 2 caracteres',
      'string.max': 'Título da tarefa deve ter no máximo 255 caracteres',
      'any.required': 'Título da tarefa é obrigatório',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
      'string.max': 'Descrição da tarefa deve ter no máximo 5000 caracteres',
    }),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending').messages({
      'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
    }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium').messages({
      'any.only': 'Prioridade deve ser: low, medium, high ou critical',
    }),
    dueDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de vencimento deve estar no formato ISO (YYYY-MM-DD)',
    }),
    projectId: Joi.number().integer().min(1).required().messages({
      'number.base': 'ID do projeto deve ser um número',
      'number.integer': 'ID do projeto deve ser um número inteiro',
      'number.min': 'ID do projeto deve ser maior que 0',
      'any.required': 'ID do projeto é obrigatório',
    }),
  }),

  // Schema for creating task via project route (projectId comes from URL)
  createViaProject: Joi.object({
    title: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Título da tarefa é obrigatório',
      'string.min': 'Título da tarefa deve ter pelo menos 2 caracteres',
      'string.max': 'Título da tarefa deve ter no máximo 255 caracteres',
      'any.required': 'Título da tarefa é obrigatório',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
      'string.max': 'Descrição da tarefa deve ter no máximo 5000 caracteres',
    }),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending').messages({
      'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
    }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium').messages({
      'any.only': 'Prioridade deve ser: low, medium, high ou critical',
    }),
    dueDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de vencimento deve estar no formato ISO (YYYY-MM-DD)',
    }),
  }),

  update: Joi.object({
    title: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Título da tarefa deve ter pelo menos 2 caracteres',
      'string.max': 'Título da tarefa deve ter no máximo 255 caracteres',
    }),
    description: Joi.string().max(5000).optional().allow('').messages({
      'string.max': 'Descrição da tarefa deve ter no máximo 5000 caracteres',
    }),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().messages({
      'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
    }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
      'any.only': 'Prioridade deve ser: low, medium, high ou critical',
    }),
    dueDate: Joi.date().iso().optional().messages({
      'date.format': 'Data de vencimento deve estar no formato ISO (YYYY-MM-DD)',
    }),
  }),

  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Página deve ser um número',
      'number.integer': 'Página deve ser um número inteiro',
      'number.min': 'Página deve ser maior que 0',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limite deve ser um número',
      'number.integer': 'Limite deve ser um número inteiro',
      'number.min': 'Limite deve ser maior que 0',
      'number.max': 'Limite deve ser menor que 100',
    }),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().messages({
      'any.only': 'Status deve ser: pending, in_progress, completed ou cancelled',
    }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional().messages({
      'any.only': 'Prioridade deve ser: low, medium, high ou critical',
    }),
    projectId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'ID do projeto deve ser um número',
      'number.integer': 'ID do projeto deve ser um número inteiro',
      'number.min': 'ID do projeto deve ser maior que 0',
    }),
    overdue: Joi.boolean().optional().messages({
      'boolean.base': 'Overdue deve ser um valor booleano',
    }),
    dueInDays: Joi.number().integer().min(0).max(365).optional().messages({
      'number.base': 'Dias deve ser um número',
      'number.integer': 'Dias deve ser um número inteiro',
      'number.min': 'Dias deve ser maior ou igual a 0',
      'number.max': 'Dias deve ser menor que 365',
    }),
    search: Joi.string().min(2).max(255).optional().messages({
      'string.min': 'Busca deve ter pelo menos 2 caracteres',
      'string.max': 'Busca deve ter no máximo 255 caracteres',
    }),
  }),
};

// Parameter validation schemas
export const paramSchemas = {
  id: Joi.object({
    id: Joi.number().integer().min(1).required().messages({
      'number.base': 'ID deve ser um número',
      'number.integer': 'ID deve ser um número inteiro',
      'number.min': 'ID deve ser maior que 0',
      'any.required': 'ID é obrigatório',
    }),
  }),

  projectId: Joi.object({
    projectId: Joi.number().integer().min(1).required().messages({
      'number.base': 'ID do projeto deve ser um número',
      'number.integer': 'ID do projeto deve ser um número inteiro',
      'number.min': 'ID do projeto deve ser maior que 0',
      'any.required': 'ID do projeto é obrigatório',
    }),
  }),

  github: Joi.object({
    id: Joi.number().integer().min(1).required().messages({
      'number.base': 'ID do projeto deve ser um número',
      'number.integer': 'ID do projeto deve ser um número inteiro',
      'number.min': 'ID do projeto deve ser maior que 0',
      'any.required': 'ID do projeto é obrigatório',
    }),
    username: Joi.string().min(1).max(39).pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i).required().messages({
      'string.empty': 'Nome de usuário do GitHub é obrigatório',
      'string.min': 'Nome de usuário do GitHub deve ter pelo menos 1 caractere',
      'string.max': 'Nome de usuário do GitHub deve ter no máximo 39 caracteres',
      'string.pattern.base': 'Nome de usuário do GitHub tem formato inválido',
      'any.required': 'Nome de usuário do GitHub é obrigatório',
    }),
  }),

  githubRepo: Joi.object({
    githubId: Joi.number().integer().min(1).required().messages({
      'number.base': 'githubId deve ser um número',
      'number.integer': 'githubId deve ser um número inteiro',
      'number.min': 'githubId deve ser maior que 0',
      'any.required': 'githubId é obrigatório',
    }),
    name: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'Nome do repositório é obrigatório',
      'string.min': 'Nome do repositório deve ter pelo menos 1 caractere',
      'string.max': 'Nome do repositório deve ter no máximo 100 caracteres',
      'any.required': 'Nome do repositório é obrigatório',
    }),
    fullName: Joi.string().min(1).max(200).required().messages({
      'string.empty': 'Nome completo do repositório é obrigatório',
      'string.min': 'Nome completo deve ter pelo menos 1 caractere',
      'string.max': 'Nome completo deve ter no máximo 200 caracteres',
      'any.required': 'Nome completo do repositório é obrigatório',
    }),
    description: Joi.string().max(500).allow(null, '').optional().messages({
      'string.max': 'Descrição deve ter no máximo 500 caracteres',
    }),
    htmlUrl: Joi.string().uri().required().messages({
      'string.empty': 'URL do repositório é obrigatória',
      'string.uri': 'URL deve ser válida',
      'any.required': 'URL do repositório é obrigatória',
    }),
    cloneUrl: Joi.string().uri().required().messages({
      'string.empty': 'URL de clone é obrigatória',
      'string.uri': 'URL de clone deve ser válida',
      'any.required': 'URL de clone é obrigatória',
    }),
    language: Joi.string().max(50).allow(null, '').optional().messages({
      'string.max': 'Linguagem deve ter no máximo 50 caracteres',
    }),
    stargazersCount: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Número de estrelas deve ser um número',
      'number.integer': 'Número de estrelas deve ser um número inteiro',
      'number.min': 'Número de estrelas não pode ser negativo',
    }),
    forksCount: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Número de forks deve ser um número',
      'number.integer': 'Número de forks deve ser um número inteiro',
      'number.min': 'Número de forks não pode ser negativo',
    }),
    private: Joi.boolean().default(false).messages({
      'boolean.base': 'Campo private deve ser true ou false',
    }),
    username: Joi.string().min(1).max(39).pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i).required().messages({
      'string.empty': 'Nome de usuário é obrigatório',
      'string.min': 'Nome de usuário deve ter pelo menos 1 caractere',
      'string.max': 'Nome de usuário deve ter no máximo 39 caracteres',
      'string.pattern.base': 'Nome de usuário tem formato inválido',
      'any.required': 'Nome de usuário é obrigatório',
    }),
    githubCreatedAt: Joi.date().iso().optional().messages({
      'date.format': 'Data de criação deve estar no formato ISO',
    }),
    githubUpdatedAt: Joi.date().iso().optional().messages({
      'date.format': 'Data de atualização deve estar no formato ISO',
    }),
  }),
};

// Generic validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
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
    } else if (property === 'body') {
      req.body = value;
    } else if (property === 'params') {
      Object.assign(req.params, value);
    }
    next();
  };
};

// Specific validation middlewares
export const validateProject = {
  create: validate(projectSchemas.create, 'body'),
  update: validate(projectSchemas.update, 'body'),
  query: validate(projectSchemas.query, 'query'),
};

export const validateTask = {
  create: validate(taskSchemas.create, 'body'),
  createViaProject: validate(taskSchemas.createViaProject, 'body'),
  update: validate(taskSchemas.update, 'body'),
  query: validate(taskSchemas.query, 'query'),
};

export const validateParams = {
  id: validate(paramSchemas.id, 'params'),
  projectId: validate(paramSchemas.projectId, 'params'),
  github: validate(paramSchemas.github, 'params'),
};

export const validateGitHub = {
  createRepo: validate(paramSchemas.githubRepo, 'body'),
};

// Search validation
export const validateSearch = validate(
  Joi.object({
    q: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Termo de busca é obrigatório',
      'string.min': 'Termo de busca deve ter pelo menos 2 caracteres',
      'string.max': 'Termo de busca deve ter no máximo 255 caracteres',
      'any.required': 'Termo de busca é obrigatório',
    }),
    projectId: Joi.number().integer().min(1).optional().messages({
      'number.base': 'ID do projeto deve ser um número',
      'number.integer': 'ID do projeto deve ser um número inteiro',
      'number.min': 'ID do projeto deve ser maior que 0',
    }),
  }),
  'query'
);
