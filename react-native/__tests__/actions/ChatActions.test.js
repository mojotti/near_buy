import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {
  createChat,
  handleChatCreation,
  requestChats,
} from '../../src/redux/actions/ChatActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

const sellerId = 0;
const itemId = 0;
const token = 'fake token';
const title = 'foo';

const ITEM = {
  sellerId,
  itemId,
  title,
};

describe('createChat', () => {
  beforeEach(() => {
    store.clearActions();
  });

  test('creates a new chat', async () => {
    fetch.mockResponseSuccess({ ok: true });

    await await await await store.dispatch(createChat(ITEM, token));
    expect(store.getActions()).toMatchSnapshot();
  });

  test('fails to create a new chat', async () => {
    fetch.mockResponseSuccess({ ok: false });

    await await await await store.dispatch(createChat(ITEM, token));
    expect(store.getActions()).toMatchSnapshot();
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');

    await await await await await store.dispatch(createChat(ITEM, token));
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('requestChats', () => {
  beforeEach(() => {
    store.clearActions();
  });

  test('cannot get chats', async () => {
    fetch.mockResponseSuccess({ chats: 'could not get chats' });

    await await await await store.dispatch(requestChats(token));
    expect(store.getActions()).toMatchSnapshot();
  });

  test('gets chats', async () => {
    fetch.mockResponseSuccess({ chats: [1, 2, 3] });

    await await await await store.dispatch(requestChats(token));
    expect(store.getActions()).toMatchSnapshot();
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');

    await await await await store.dispatch(requestChats(token));
    expect(store.getActions()).toMatchSnapshot();
  });
});
