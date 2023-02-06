exports.up = function (knex) {
  return knex.schema.createTable('conversations', function (table) {
    table.increments('id');
    table.integer('sender').notNullable();
    table.integer('receiver').notNullable();
    table.string('message', 255).notNullable();
    table.timestamps(true, true);

    table.foreign('sender').references('id').inTable('users');

    table.foreign('receiver').references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('conversations');
};
