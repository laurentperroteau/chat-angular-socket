const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// db init
const adapter = new FileSync('db.json');
const db = low(adapter);

// set defaults values
db.defaults({ messages: [], users: [] })
  .write();

// TODO: use https://github.com/typicode/lodash-id
let id = 1;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('add-message', (message) => {
    console.log('add-message', message);
    const newMessage = Object.assign({}, {id: id}, message);
    id++;

    // Save message
    db.get('messages')
      .push(newMessage)
      .write(); // can return Promise with FileAsync adapter

    const users = db.get('users')
      .filter({id: newMessage.userId})
      .value();

    newMessage.username = users[0].name;

    io.emit('chat', {type:'new-message', payload: newMessage});
  });

  socket.on('set-user', (username) => {
    const user = { id: id, name: username };
    console.log('set-user', username);
    id++;

    // Save message
    db.get('users')
      .push(user)
      .write(); // can return Promise with FileAsync adapter

    io.emit('chat', {type: 'user-setted', payload: user});
  });
});

http.listen(5000, () => {
  console.log('started on port 5000');
});
