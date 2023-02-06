import knex from 'knex';

import databaseConfig from '../../knexfile.cjs';

export const dbConnection = knex(databaseConfig.development);
