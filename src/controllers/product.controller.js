const Product = require('../models/products');
const { omit } = require('lodash');
const { handler } = require('../middlewares/error');
const { generatePdf } = require('../utils/pdfGenerate');

exports.load = async (req, res, next, id) => {
	try {
		const product = await Product.prototype.get(id);
		req.locals = { product };
		return next();
	} catch (e) {
		return handler(e, req, res);
	}
};

exports.get = (req, res) => res.json(req.locals.product);

exports.list = async (req, res) => {
	try {
		let products = await Product.prototype.list(req.query);
		if (products) return res.json(products);
	} catch (e) {
		handler(e, req, res);
	}
};

exports.create = async (req, res) => {
	try {
		const product = await Product.prototype.create(req.body);
		if (product) return res.json(product.dataValues)
	} catch (e) {
		handler(e, req, res);
	}
};

exports.update = async (req, res) => {
	try {
		const updatedProduct = omit(req.body);
		const transform = Object.assign(req.locals.product, updatedProduct);
		const product = await Product.prototype.update(transform);
		if (product) return res.json(transform)
	} catch (e) {
		handler(e, req, res);
	}
};

exports.delete = async (req, res) => {
	try {
		const { product } = req.locals;
		const detele = await Product.prototype.delete(product.id);
		if (detele) return res.json(detele.dataValues)
	} catch (e) {
		handler(e, req, res);
	}
};

exports.pdf = async (req, res) => {
	try {
		generatePdf(res, req.body)
	} catch (e) {
		return handler(e, req, res);
	}
};