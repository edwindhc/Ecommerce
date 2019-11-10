// const Joi = require('joi');


// module.exports = {
//     listProduts: {
//         query: {
//             page: Joi.number().min(1),
//             perPage: Joi.number().min(0).max(100),
//             title: Joi.string(),
//             model: Joi.string(),
//             sku: Joi.string(),
//             price: Joi.number(),
//             CategoryId: Joi.string(),
//         },
//     },

//     createProduct: {
//         body: {
//             title: Joi.string().required(),
//             model: Joi.string().required(),
//             sku: Joi.string().required(),
//             price: Joi.number().required(),
//             CategoryId: Joi.string().required(),
//         },
//     },

//     updateProduct: {
//         body: {
//             title: Joi.string(),
//             model: Joi.string(),
//             sku: Joi.string(),
//             price: Joi.number(),
//             CategoryId: Joi.string(),
//         },
//         params: {
//             productId: Joi.string().required(),
//         },
//     },
// };
