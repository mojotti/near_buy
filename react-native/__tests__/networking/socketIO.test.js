import {
  createRoom,
  generateRoomId,
  getGlobals,
  setRoomDetails,
  setSocketForTesting
} from '../../src/networking/socketIO';

let EMIT_SPY = null;

describe('socketIO', () => {
  beforeAll(() => {
    const details = {
      itemId: 0,
      userId: 1,
      sellerId: 2,
    };

    setRoomDetails(details);
  });

  beforeEach(() => {
    EMIT_SPY = jest.fn();

    const socket = {
      emit: EMIT_SPY,
    };
    setSocketForTesting(socket);
  });

  test('sets room details', () => {
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
});
