import { localhost } from '../static/constants';

window.navigator.userAgent = 'ReactNative';

const io = require('socket.io-client/dist/socket.io');

const path = `http://${localhost}:5000`;
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'], // you need to explicitly tell it to use websockets
};

const sockets = {};

export const destroySocket = (itemId, userId, sellerId) => {
  const roomId = getRoomId(itemId, userId, sellerId);
  if (sockets[roomId]) {
    delete sockets[roomId];
  }
};

export const connectSocket = (itemId, userId, sellerId) => {
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
  sockets[room].emit('create_room', room);
};

export const sendMessage = (msg, room) => {
  const payload = {
    msg,
    room,
  };
  sockets[room].emit('message', JSON.stringify(payload));
};

const listenToMessages = roomId => {
  // listen messages in room
  sockets[roomId].on('message', msg => {
    console.log('received some shit in chat', msg);
  });
};

// only for testing
export const setSocketForTesting = (s, room) => {
  sockets[room] = s;
};
