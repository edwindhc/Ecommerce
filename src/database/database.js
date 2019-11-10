const Sequelize = require('sequelize');

// const connection = new Sequelize(
//     process.env.DATABASE_URL,
//     {
//         dialect: 'postgres',
//         pool: {
//             max: 5,
//             min: 0,
//             require: 30000,
//             idle: 10000
//         },
//         loggin: false,

//     }
// )

// module.exports = { connection };

const connection = new Sequelize(
    'postgres',
    'postgres',
    'edwin',
    {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        loggin: false,

    }
)
module.exports = { connection };