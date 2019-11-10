// const Joi = require('joi');


// module.exports = {

//     listCategories: {
//         query: {
//             page: Joi.number().min(1),
//             perPage: Joi.number().min(0).max(100),
//             name: Joi.string()
//         },
//     },

//     createCategories: {
//         body: {
//             name: Joi.string().required()
//         },
//     },

//     updateCategories: {
//         body: {
//             name: Joi.string()
//         },
//         params: {
//             productId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
//         },
//     },
// };
