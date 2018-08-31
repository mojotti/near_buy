/* eslint-disable camelcase */
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

let socket = null;

let ITEM_ID = null;
let USER_ID = null;
let SELLER_ID = null;

export const setRoomDetails = (details) => {
  ITEM_ID = details.itemId;
  USER_ID = details.userId;
  SELLER_ID = details.sellerId;
};

export const connectSocket = (itemId, userId, sellerId) => {
  if (!socket || !socket.connected) {
    socket = io(path, connectionConfig);
    socket.on('connect', () => {
      console.log('connected!');
      setRoomDetails({ itemId, userId, sellerId });
      createRoom();
    });
  }
};

export const generateRoomId = () => {
  return `item_id:${ITEM_ID}user_id:${USER_ID}seller_id:${SELLER_ID}`;
};

export const createRoom = () => {
  const config = generateRoomId();
  socket.emit('create_room', config);
};

export const sendMsg = (msg) => {
  socket.emit('lol', msg);
};

// only for testing
export const setSocketForTesting = (s) => {
  socket = s;
};

export const getGlobals = () => {
  return { ITEM_ID, USER_ID, SELLER_ID };
};
