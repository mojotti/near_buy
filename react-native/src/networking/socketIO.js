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
let room = null;

let ITEM_ID = null;
let USER_ID = null;
let SELLER_ID = null;

export const setRoomDetails = (details) => {
  ITEM_ID = details.itemId;
  USER_ID = details.userId;
  SELLER_ID = details.sellerId;
};

export const connectSocket = (itemId, userId, sellerId) => {
  socket = io(path, connectionConfig);
  socket.on('connect', () => {
    setRoomDetails({ itemId, userId, sellerId });
    createRoom();
    listenToMessages();
  });
};

export const generateRoomId = () => {
  return `item_id:${ITEM_ID}user_id:${USER_ID}seller_id:${SELLER_ID}`;
};

export const createRoom = () => {
  room = generateRoomId();
  socket.emit('create_room', room);
};

export const sendMessage = (msg) => {
  const payload = {
    msg,
    room,
  };
  socket.emit('message', JSON.stringify(payload));
};

const listenToMessages = () => {
  // listen messages in room
  socket.on('message', (msg) => {
    console.log('received some shit in chat', msg);
  });
};


// only for testing
export const setSocketForTesting = (s) => {
  socket = s;
};

export const getGlobals = () => {
  return { ITEM_ID, USER_ID, SELLER_ID };
};