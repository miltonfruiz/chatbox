class ChatController {
  constructor(io) {
    this.io = io;
    this.messages = [];
  }

  createMessage(socket, message) {
    this.messages.push(message);
    this.io.emit('newMessage', message);
  }

  readMessages(socket) {
    socket.emit('messages', this.messages);
  }

  updateMessage(socket, id, message) {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      this.messages[index] = message;
      this.io.emit('updateMessage', message);
    }
  }

  deleteMessage(socket, id) {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      this.io.emit('deleteMessage', id);
    }
  }
}

module.exports = ChatController;

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let chatController = new ChatController(io);

io.on('connection', socket => {
  console.log('nuevo usuario conectado');

  socket.on('newMessage', message => {
    chatController.createMessage(socket, message);
  });

  socket.on('getMessages', () => {
    chatController.readMessages(socket);
  });

  socket.on('updateMessage', (id, message) => {
    chatController.updateMessage(socket, id, message);
  });

  socket.on('deleteMessage', id => {
    chatController.deleteMessage(socket, id);
  });

  socket.on('disconnect', () => {
    console.log('usuario desconectado');
  });
});

server.listen(3000, () => {
  console.log('server escuchando en el puerto 3000');
});