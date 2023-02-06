import { dbConnection } from '../database/connection.js';

export class ConversationsController {
  async show(request, response) {
    const sender_id = request.userId;
    const { receiver_id } = request.params;

    const [foundUserReceiver] = await dbConnection('users')
      .select('id')
      .where({ id: receiver_id });

    const [foundUserSender] = await dbConnection('users')
      .select('id')
      .where({ id: sender_id });

    if (!foundUserReceiver) {
      return response.status(400).json({ error: 'Receiver does not exists' });
    }

    if (!foundUserSender) {
      return response.status(400).json({ error: 'Sender does not exists' });
    }

    const foundConversation = await dbConnection('conversations')
      .select()
      .where({
        sender: sender_id,
        receiver: receiver_id,
      })
      .orWhere({
        sender: receiver_id,
        receiver: sender_id,
      })
      .orderBy('created_at', 'asc');

    return response.json(foundConversation);
  }

  async create(request, response) {
    const { message } = request.body;
    const { receiver_id } = request.params;
    const sender_id = request.userId;

    const [foundUserReceiver] = await dbConnection('users')
      .select('id')
      .where({ id: receiver_id });

    const [foundUserSender] = await dbConnection('users')
      .select('id')
      .where({ id: sender_id });

    if (!foundUserReceiver) {
      return response.status(400).json({ error: 'Receiver does not exists' });
    }

    if (!foundUserSender) {
      return response.status(400).json({ error: 'Sender does not exists' });
    }

    const [conversationId] = await dbConnection('conversations').insert({
      sender: sender_id,
      receiver: receiver_id,
      message,
    });

    const [conversationCreatedAt] = await dbConnection('conversations')
      .select('created_at')
      .where({ id: conversationId });

    const createdConversation = {
      id: conversationId,
      sender: sender_id,
      receiver: Number(receiver_id),
      message,
      created_at: conversationCreatedAt.created_at,
    };

    const targetSocket = request.connectedUsers[receiver_id];
    console.log('🚀 ~ targetSocket', targetSocket);

    if (targetSocket) {
      request.io
        .to(targetSocket)
        .emit('new_message', JSON.stringify(createdConversation));
    }

    return response.json(createdConversation);
  }
}
