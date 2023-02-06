import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConnection } from '../database/connection.js';
import { jwtConfig } from '../lib/jwt.js';

export class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const [foundUser] = await dbConnection('users')
      .select('id', 'password')
      .where({ email });

    if (!foundUser) {
      return response.status(404).json({
        message: 'User not found',
      });
    }

    const matchedPassword = await compare(password, foundUser.password);

    if (!matchedPassword) {
      return response.status(404).json({
        message: 'Email or password incorrect',
      });
    }

    const token = jwt.sign({ id: foundUser.id }, jwtConfig.secret, {
      expiresIn: '1d',
    });

    return response.json({ token, id: foundUser.id });
  }
}
