# Socket.IO - Client Side


## Send messages

This value will be sent to all players in the room.
```js
io.to(cache.user[socket.id].roomId)
```

This value will only be sent to the player who owns this socket.
```js
socket.emit('player-join', socket.id);
```

This value will be sent to all players in entire server (all rooms), except for the player who owns this socket.
```js
socket.broadcast.emit('online-users', cache.online);
```