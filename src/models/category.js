const Sequelize = require('sequelize');
const connection = require('../database/database').connection;
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const Category = connection.define('Categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
    }
}, {
    timestamps: true
});


Category.associate = function (models) { }

Category.prototype.get = async (id) => {
    try {
        const category = await Category.findByPk(id, { raw: true, });
        if (category) return category;

        throw new APIError({
            message: 'Categoria no existente',
            status: httpStatus.NOT_FOUND,
        });
    } catch (e) {
        throw e;
    }
}

Category.prototype.list = async ({ page = 1, perPage = 30, name, createdAt, fromDate, toDate }) => {
    try {
        let pagination;
        let options = omitBy({ name, createdAt }, isNil);
        if (options.name) options = { ...options, ...{ name: { [Sequelize.Op.like]: `%${name}%` } } }

        if (fromDate && toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.gte]: fromDate, [Sequelize.Op.lte]: toDate } } }

        if (fromDate && !toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.gte]: fromDate } } }

        if (!fromDate && toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.lte]: toDate } } }

        if (perPage > 0) pagination = { offset: perPage * (page - 1), limit: perPage }

        const query = {
            raw: true,
            order: [
                ['createdAt', 'DESC'],
            ],
            where: options,
            ...pagination
        }
        const test = await Category.findAndCountAll(query);
        return Category.findAndCountAll(query)
    } catch (e) {
        throw e;
    }
}

Category.prototype.create = async (body) => {
    try {
        const category = await Category.create(body);
        if (category) return category;
    } catch (e) {
        throw e;
    }
}

Category.prototype.update = async (cat) => {
    try {
        const id = cat.id;
        const category = await Category.update(cat, { where: { id } });
        if (category) return category;

        throw new APIError({
            message: 'Categoria no existente',
            status: httpStatus.NOT_FOUND
        });
    } catch (e) {
        throw e;
    }
}

Category.prototype.delete = async (id) => {
    try {
        const category = await Category.destroy({ where: { id } });
        if (category) return category;

        throw new APIError({
            message: 'Categoria no existente',
            status: httpStatus.NOT_FOUND,
        });
    } catch (e) {
        throw e;
    }
}

module.exports = Category;