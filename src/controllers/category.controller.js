const Category = require('../models/category');
const { omit } = require('lodash');
const { handler } = require('../middlewares/error');

exports.load = async (req, res, next, id) => {
	try {
		const category = await Category.prototype.get(id);
		req.locals = { category };
		return next();
	} catch (e) {
		return handler(e, req, res);
	}
};

exports.get = (req, res) => res.json(req.locals.category);

exports.list = async (req, res) => {
	try {
		let categories = await Category.prototype.list(req.query);
		if (categories) return res.json(categories);
	} catch (e) {
		console.log(e, ' category desde el controller')
		handler(e, req, res);
	}
};

exports.create = async (req, res) => {
	try {
		const category = await Category.prototype.create(req.body);
		if (category) return res.json(category.dataValues)

	} catch (e) {
		handler(e, req, res);
	}
};

exports.update = async (req, res) => {
	try {
		const updatedCategory = omit(req.body);
		const transform = Object.assign(req.locals.category, updatedCategory);
		const category = await Category.prototype.update(transform);
		if (category) return res.json(transform)
	} catch (e) {
		handler(e, req, res);
	}
};

exports.delete = async (req, res) => {
	try {
		const { category } = req.locals;
		const detele = await Category.prototype.delete(category.id);
		if (detele) return res.json(detele.dataValues)
	} catch (e) {
		handler(e, req, res);
	}
};