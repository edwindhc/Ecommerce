const Sequelize = require('sequelize');
const connection = require('../database/database').connection;
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const Category = require('./category')

const product = connection.define('Products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    model: {
        type: Sequelize.STRING
    },
    sku: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.TEXT
    },
    CategoryId: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: true,
});


product.belongsTo(Category, { source: 'id' });
product.associate = function (models) {
    Category.hasMany(models.Products, { foreingKey: 'CategoryId', sourceKey: 'id' });

}

product.prototype.get = async (id) => {
    try {
        const producto = await product.findByPk(id, {
            raw: true,
            include: [{
                model: Category,
                attributes: ['name']
            }]
        });
        if (producto) return producto;

        throw new APIError({
            message: 'Producto no existente',
            status: httpStatus.NOT_FOUND,
        });
    } catch (e) {
        throw e;
    }
}
product.prototype.list = async ({ page = 1, perPage = 30, title, model, sku, CategoryId, fromDate, toDate }) => {
    try {
        let pagination;
        let options = omitBy({ model, title, sku, CategoryId, fromDate, toDate }, isNil);

        if (options.title) options = { ...options, ...{ title: { [Sequelize.Op.like]: `%${title}%` } } };

        else if (fromDate && toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.gte]: fromDate, [Sequelize.Op.lte]: toDate } } };

        if (fromDate && !toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.gte]: fromDate } } }

        if (!fromDate && toDate) options = { ...options, ...{ createdAt: { [Sequelize.Op.lte]: toDate } } }

        if (perPage > 0) pagination = { offset: perPage * (page - 1), limit: perPage };

        const query = {
            raw: true,
            order: [
                ['createdAt', 'DESC'],
            ],
            where: options,
            include: [{
                model: Category,
                attributes: ['name']
            }],
            ...pagination
        }
        return product.findAndCountAll(query)
    } catch (e) {
        throw e;
    }
}

product.prototype.create = async (body) => {
    try {
        const category = await Category.findByPk(body.CategoryId, { raw: true, });
        console.log(category, ' categoryyyyy')
        if (!category) throw new APIError({
            message: 'Categoria no existente',
            status: httpStatus.NOT_FOUND,
        });

        const producto = await product.create(body);
        if (producto) return producto;
    } catch (e) {
        throw e;
    }
}

product.prototype.update = async (producto) => {
    try {
        const id = producto.id;
        if (producto.CategoryId) {
            const category = await Category.findByPk(producto.CategoryId);
            if (!category) throw new APIError({
                message: 'Categoria no existente',
                status: httpStatus.NOT_FOUND,
            });
        }
        const productUpdate = await product.update(producto, { where: { id } });
        if (productUpdate) return productUpdate;

        throw new APIError({
            message: 'Producto no existente',
            status: httpStatus.NOT_FOUND,
        });
    } catch (e) {
        throw e;
    }
}

product.prototype.delete = async (id) => {
    try {
        const producto = await product.destroy({ where: { id } });
        if (producto) return producto;

        throw new APIError({
            message: 'Producto no existente',
            status: httpStatus.NOT_FOUND,
        });
    } catch (e) {
        throw e;
    }
}

module.exports = product;