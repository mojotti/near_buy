import {
  createNewChat,
  getNumOfPictures,
  getChatsForUser,
} from '../../src/networking/ApiCalls';

describe('createNewChat', () => {
  const sellerId = 0;
  const itemId = 0;
  const title = 'foo';
  const itemDetails = { title, sellerId, itemId };
  const token = 'fake token';

  test('creates a new chat', async () => {
    fetch.mockResponseSuccess({ ok: true });

    expect.hasAssertions();
    const response = await await createNewChat(itemDetails, token);

    expect(response).toEqual('chat created');
  });

  test('does not create a new chat', async () => {
    fetch.mockResponseSuccess({ ok: false });

    expect.hasAssertions();
    const response = await await createNewChat(itemDetails, token);

    expect(response).toEqual('error');
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');

    expect.hasAssertions();
    try {
      await await await createNewChat(itemDetails, token);
    } catch (e) {
      expect(e).toEqual('error');
    }
  });
});

describe('getChats', () => {
  test('gets the chats user belongs to', async () => {
    const mockedChats = [
      {
        item_id: 0,
        buyer_id: 1,
        seller_id: 0,
      },
    ];
    const mockedResponse = { chats: mockedChats };
    fetch.mockResponseSuccess(mockedResponse);

    const response = await await getChatsForUser('fake token');

    expect(response).toEqual(mockedChats);
  });

  test('does not get the chats user belongs to', async () => {
    fetch.mockResponseSuccess({ ok: false });

    const response = await await getChatsForUser('fake token');

    expect(response).toEqual('could not get chats');
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');

    try {
      await await await getChatsForUser('fake token');
    } catch (e) {
      expect(e).toEqual('error');
    }
  });
});

describe('getNumOfPictures', () => {
  test('gets num of pictures', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });

    return getNumOfPictures().then(result => {
      expect(result).toEqual(1);
    });
  });

  test('does not get num of pictures', () => {
    fetch.mockResponseFailure('error');

    return getNumOfPictures().then(result => {
      expect(result).toEqual(0);
    });
  });
});
