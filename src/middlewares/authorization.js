import { verify } from 'jsonwebtoken';
import { jwtConfig } from '../lib/jwt.js';

export function authorization(request, response, next) {
  try {
    const tokenData =
      request.headers['authorization'] || request.headers['Authorization'];

    const token = tokenData.split(' ')[1];

    const payload = verify(token, jwtConfig.secret);

    request.userId = payload.id;

    next();
  } catch (error) {
    console.error('🚀 ~ error', error);
    return response.status(401).json({ message: 'Unauthorized user' });
  }
}
