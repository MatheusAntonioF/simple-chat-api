import { Router } from 'express';
import { ConversationsController } from '../controllers/conversations.controller.js';
import { SessionController } from '../controllers/session.controller.js';
import { UsersController } from '../controllers/users.controller.js';
import { authorization } from '../middlewares/authorization.js';

const usersController = new UsersController();
const sessionController = new SessionController();
const conversationsController = new ConversationsController();

const appRoutes = Router();

appRoutes.post('/session', sessionController.create);
appRoutes.post('/users', usersController.create);

appRoutes.use(authorization);

appRoutes.get('/users', usersController.index);
appRoutes.get('/me', usersController.me);
appRoutes.put('/users', usersController.update);
appRoutes.get('/users/:receiver_id/conversation', conversationsController.show);

appRoutes.post('/conversations/:receiver_id', conversationsController.create);
export { appRoutes };
