import { localhost } from '../static/constants';

window.navigator.userAgent = 'ReactNative';

const io = require('socket.io-client/dist/socket.io');

const path = `http://${localhost}:5000`;
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'],
};

const sockets = {};

export const destroySocket = (itemId, userId, sellerId) => {
  const roomId = getRoomId(itemId, userId, sellerId);

  if (sockets[roomId]) {
    sockets[roomId].disconnect();
    delete sockets[roomId];
  }
};

export const connectSocket = (itemId, userId, sellerId) => {
  if (isNaN(itemId) || isNaN(userId) || isNaN(sellerId)) {
    console.warn('invalid room details', itemId, userId, sellerId);
    return;
  }
  const roomId = getRoomId(itemId, userId, sellerId);
  if (!sockets[roomId]) {
    sockets[roomId] = io(path, connectionConfig);
    sockets[roomId].on('connect', () => {
      createRoom(itemId, userId, sellerId);
      listenToMessages(roomId);
    });
  }
};

export const getRoomId = (itemId, userId, sellerId) => {
  return `item_id:${itemId}user_id:${userId}seller_id:${sellerId}`;
};

export const createRoom = (itemId, userId, sellerId) => {
  const room = getRoomId(itemId, userId, sellerId);
  const socket = sockets[room] || null;
  if (!room || !socket) {
    console.warn('failed to create a socket', room);
    return;
  }
  sockets[room].emit('create_room', room);
};

export const sendMessage = (msg, room) => {
  const socket = sockets[room] || null;
  if (!socket) {
    console.warn('sending msg in non-existing room', room);
    return;
  }
  const payload = {
    msg,
    room,
  };
  sockets[room].emit('message', JSON.stringify(payload));
};

const listenToMessages = room => {
  const socket = sockets[room] || null;
  if (!room || !socket) {
    console.warn('failed to listen messages', room);
    return;
  }
  socket.on('message', msg => {
    console.log('received some shit in chat', msg);
  });
};

// only for testing
export const setSocketForTesting = (s, room) => {
  sockets[room] = s;
};
