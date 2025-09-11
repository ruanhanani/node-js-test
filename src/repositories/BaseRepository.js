"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data, options) {
        return await this.model.create(data, options);
    }
    async findAll(options) {
        return await this.model.findAll(options);
    }
    async findById(id, options) {
        return await this.model.findByPk(id, options);
    }
    async findOne(options) {
        return await this.model.findOne(options);
    }
    async update(id, data, options) {
        const result = await this.model.update(data, {
            where: { id },
            returning: true,
            ...options,
        });
        return result;
    }
    async delete(id, options) {
        return await this.model.destroy({
            where: { id },
            ...options,
        });
    }
    async count(options) {
        return await this.model.count(options);
    }
    async findByIds(ids, options) {
        return await this.model.findAll({
            where: {
                id: ids,
            },
            ...options,
        });
    }
    async exists(id) {
        const count = await this.model.count({
            where: { id },
        });
        return count > 0;
    }
    async bulkCreate(data, options) {
        return await this.model.bulkCreate(data, options);
    }
    async findAndCountAll(options) {
        return await this.model.findAndCountAll(options);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map