import {
  createRoom,
  getRoomId,
  sendMessage,
  setSocketForTesting,
  connectSocket,
  destroySocket,
} from '../../src/networking/socketIO';
const io = require('socket.io-client/dist/socket.io');

let EMIT_SPY = null;

jest.mock('socket.io-client/dist/socket.io', () => {
  return jest.fn(() => {
    return {
      on: jest.fn(),
    };
  });
});

const setUpSocket = (itemId, userId, sellerId) => {
  EMIT_SPY = jest.fn();

  const socket = {
    emit: EMIT_SPY,
  };
  const id = getRoomId(itemId, userId, sellerId);
  setSocketForTesting(socket, id);
};

describe('socketIO', () => {
  beforeEach(() => {
    setUpSocket(0, 1, 2);
  });

  test('generates room id', () => {
    const id = getRoomId(0, 1, 2);

    expect(id).toEqual('item_id:0user_id:1seller_id:2');
  });

  test('creates a new room', () => {
    createRoom(0, 1, 2);

    const expectedCall = [['create_room', 'item_id:0user_id:1seller_id:2']];
    expect(EMIT_SPY.mock.calls).toEqual(expectedCall);
  });

  test('sends message', () => {
    createRoom(0, 1, 2);
    const id = getRoomId(0, 1, 2);

    const message = 'foobar';
    sendMessage(message, id);

    const expected = [
      'message',
      '{"msg":"foobar","room":"item_id:0user_id:1seller_id:2"}',
    ];
    expect(EMIT_SPY.mock.calls[1]).toEqual(expected);
  });
});

describe('connectSocket', () => {
  beforeEach(() => {
    destroySocket(0, 1, 2);
    io.mock.calls = [];
  });

  test('connects if there is no socket already', () => {
    connectSocket(0, 1, 2);
    expect(io.mock.calls.length).toEqual(1);
    expect(io.mock.calls[0][0]).toEqual('http://localhost:5000');
  });

  test('does not connect if socket is connected already', () => {
    connectSocket(0, 1, 2);
    expect(io.mock.calls.length).toEqual(1);

    for (let i = 0; i < 10; i++) {
      // to test continuous tries
      connectSocket(0, 1, 2);
      expect(io.mock.calls.length).toEqual(1);
    }
  });
});
