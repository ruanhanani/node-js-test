import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const projectSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    query: Joi.ObjectSchema<any>;
};
export declare const taskSchemas: {
    create: Joi.ObjectSchema<any>;
    update: Joi.ObjectSchema<any>;
    query: Joi.ObjectSchema<any>;
};
export declare const paramSchemas: {
    id: Joi.ObjectSchema<any>;
    projectId: Joi.ObjectSchema<any>;
    github: Joi.ObjectSchema<any>;
};
export declare const validate: (schema: Joi.ObjectSchema, property?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateProject: {
    create: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    update: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    query: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export declare const validateTask: {
    create: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    update: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    query: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export declare const validateParams: {
    id: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    projectId: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    github: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
export declare const validateSearch: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map