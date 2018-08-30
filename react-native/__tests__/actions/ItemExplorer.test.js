import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { requestItemsAction } from '../../src/redux/actions/ItemExplorerAction';

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

describe('requestItemsAction', () => {
  beforeEach(() => {
    store.clearActions();
  });

  test('gets items', async () => {
    fetch.mockResponseSuccess({ items: [1, 2, 3] });

    await await store.dispatch(requestItemsAction(token));
    expect(store.getActions()).toMatchSnapshot();
  });

  test('does not get items', async () => {
    fetch.mockResponseFailure('error');

    await await await store.dispatch(requestItemsAction(token));
    expect(store.getActions()).toMatchSnapshot();
  });
});
