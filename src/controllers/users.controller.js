import { hash } from 'bcrypt';
import { dbConnection } from '../database/connection.js';

export class UsersController {
  async index(request, response) {
    const loggedUserId = request.userId;

    console.log('🚀 ~ loggedUserId', loggedUserId);

    const users = await dbConnection('users')
      .columns(
        'users.id',
        'users.name',
        'users.email',
        'users.created_at',
        'conversations.sender',
        'conversations.receiver',
        'conversations.message'
      )
      .select()
      .leftJoin('conversations', builder => {
        builder.on('conversations.receiver', '=', 'users.id');
        builder.andOn(
          'conversations.created_at',
          '=',
          dbConnection.raw(
            '(select max(created_at) from conversations where conversations.receiver = users.id)'
          )
        );
      })
      .where('users.id', '<>', loggedUserId)
      .on('query', data => {
        console.log('🚀 ~ data', data);
      });

    return response.json(users);
  }

  async me(request, response) {
    const userId = request.userId;

    const [foundUser] = await dbConnection('users')
      .select('id', 'name', 'email')
      .where({ id: userId });

    return response.json(foundUser);
  }

  async create(request, response) {
    const { name, email, password } = request.body;

    const passwordHashed = await hash(password, 8);

    await dbConnection('users').insert({
      name,
      email,
      password: passwordHashed,
    });

    return response.sendStatus(200);
  }

  async update(request, response) {
    const userId = request.userId;

    const { name, email } = request.body;

    await dbConnection('users')
      .update({ ...(name && { name }), ...(email && { email }) })
      .where({ id: userId });

    const [foundUser] = await dbConnection('users')
      .select('id', 'name', 'email')
      .where({ id: userId });

    return response.json(foundUser);
  }
}
