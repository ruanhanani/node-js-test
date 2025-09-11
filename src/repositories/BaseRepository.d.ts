import { Model, ModelCtor, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
export interface IBaseRepository<T extends Model> {
    create(data: any, options?: CreateOptions): Promise<T>;
    findAll(options?: FindOptions): Promise<T[]>;
    findById(id: number, options?: FindOptions): Promise<T | null>;
    findOne(options: FindOptions): Promise<T | null>;
    update(id: number, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
    delete(id: number, options?: DestroyOptions): Promise<number>;
    count(options?: FindOptions): Promise<number>;
    findByIds(ids: number[], options?: FindOptions): Promise<T[]>;
}
export declare class BaseRepository<T extends Model> implements IBaseRepository<T> {
    protected model: ModelCtor<T>;
    constructor(model: ModelCtor<T>);
    create(data: any, options?: CreateOptions): Promise<T>;
    findAll(options?: FindOptions): Promise<T[]>;
    findById(id: number, options?: FindOptions): Promise<T | null>;
    findOne(options: FindOptions): Promise<T | null>;
    update(id: number, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
    delete(id: number, options?: DestroyOptions): Promise<number>;
    count(options?: FindOptions): Promise<number>;
    findByIds(ids: number[], options?: FindOptions): Promise<T[]>;
    exists(id: number): Promise<boolean>;
    bulkCreate(data: any[], options?: CreateOptions): Promise<T[]>;
    findAndCountAll(options?: FindOptions): Promise<{
        rows: T[];
        count: number;
    }>;
}
//# sourceMappingURL=BaseRepository.d.ts.map