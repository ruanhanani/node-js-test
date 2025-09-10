import { Model, ModelCtor, WhereOptions, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

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

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return await this.model.create(data, options);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findById(id: number, options?: FindOptions): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async update(id: number, data: any, options?: UpdateOptions): Promise<[number, T[]]> {
    const result = await this.model.update(data, {
      where: { id } as WhereOptions,
      returning: true,
      ...options,
    }) as any;
    return result;
  }

  async delete(id: number, options?: DestroyOptions): Promise<number> {
    return await this.model.destroy({
      where: { id } as WhereOptions,
      ...options,
    });
  }

  async count(options?: FindOptions): Promise<number> {
    return await this.model.count(options);
  }

  async findByIds(ids: number[], options?: FindOptions): Promise<T[]> {
    return await this.model.findAll({
      where: {
        id: ids,
      } as WhereOptions,
      ...options,
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.model.count({
      where: { id } as WhereOptions,
    });
    return count > 0;
  }

  async bulkCreate(data: any[], options?: CreateOptions): Promise<T[]> {
    return await this.model.bulkCreate(data, options);
  }

  async findAndCountAll(options?: FindOptions): Promise<{ rows: T[]; count: number }> {
    return await this.model.findAndCountAll(options);
  }
}
