'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Categories', [
        {
        name: 'Computadoras',
        createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          name: 'Celulares y Tablets',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Videojuegos',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Camaras',
          createdAt: new Date(),
          updatedAt: new Date()
        }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
