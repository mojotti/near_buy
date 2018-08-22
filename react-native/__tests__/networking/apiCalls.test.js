import { createNewChat, getNumOfPictures } from '../../src/networking/ApiCalls';

describe('createNewChat', () => {
  const SELLER_ID = 0;
  const ITEM_ID = 0;
  const TOKEN = 'faketoken';

  test('creates a new chat', async () => {
    fetch.mockResponseSuccess({ ok: true });

    expect.hasAssertions();
    const response = await await createNewChat(SELLER_ID, ITEM_ID, TOKEN);

    expect(response).toEqual('chat created');
  });

  test('does not create a new chat', async () => {
    fetch.mockResponseSuccess({ ok: false });

    expect.hasAssertions();
    const response = await await createNewChat(SELLER_ID, ITEM_ID, TOKEN);

    expect(response).toEqual('error');
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');

    expect.hasAssertions();
    const response = await await await createNewChat(SELLER_ID, ITEM_ID, TOKEN);

    expect(response).toEqual('error');
  });
});

describe('getNumOfPictures', () => {
  test('gets num of pictures', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });

    return getNumOfPictures()
      .then(result => {
        expect(result).toEqual(1);
      });
  });

  test('does not get num of pictures', () => {
    fetch.mockResponseFailure('error');

    return getNumOfPictures()
      .then(result => {
        expect(result).toEqual(0);
      });
  });
});
