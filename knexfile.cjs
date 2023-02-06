const { join } = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'db.sqlite3'),
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
    log: {
      warn(message) {
        console.log(message);
      },
      error(message) {
        console.log(message);
      },
      deprecate(message) {
        console.log(message);
      },
      debug(message) {
        console.log(message);
      },
    },
  },
};
