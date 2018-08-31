import {
  createRoom,
  generateRoomId,
  getGlobals,
  sendMessage,
  setRoomDetails,
  setSocketForTesting
} from '../../src/networking/socketIO';

let EMIT_SPY = null;

const DETAILS = {
  itemId: 0,
  userId: 1,
  sellerId: 2,
};

describe('socketIO', () => {
  beforeAll(() => {
    setRoomDetails(DETAILS);
  });

  beforeEach(() => {
    EMIT_SPY = jest.fn();

    const socket = {
      emit: EMIT_SPY,
    };
    setSocketForTesting(socket);
  });

  test('sets room DETAILS', () => {
    expect(getGlobals().ITEM_ID).toEqual(0);
    expect(getGlobals().USER_ID).toEqual(1);
    expect(getGlobals().SELLER_ID).toEqual(2);
  });

  test('generates room id', () => {
    const id = generateRoomId();

    expect(id).toEqual('item_id:0user_id:1seller_id:2');
  });

  test('creates a new room', () => {
    createRoom();

    const expectedCall = [['create_room', 'item_id:0user_id:1seller_id:2']];
    expect(EMIT_SPY.mock.calls).toEqual(expectedCall);
  });

  test('sends message', () => {
    createRoom();

    const message = 'foobar';
    sendMessage(message);

    const expected = ['item_id:0user_id:1seller_id:2', 'foobar'];
    expect(EMIT_SPY.mock.calls[1]).toEqual(expected);
  });
});
