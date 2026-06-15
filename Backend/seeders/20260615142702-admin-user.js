'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('users', [{
      name:       'System Administrator',
      email:      'admin@store.com',
      password:   hashedPassword,
      address:    'Pune', 
      role:       'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: 'admin@storerating.com' });
  }
};