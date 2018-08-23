import { handleChatCreation } from '../../src/redux/actions/ChatActions';

describe('createChatAction', () => {
  const sellerId = 0;
  const itemId = 0;
  const token = 'fake token';

  test('creates a new chat', async () => {
    fetch.mockResponseSuccess({ ok: true });
    const dispatchSpy = jest.fn();

    // lol
    await await await await handleChatCreation(dispatchSpy, sellerId, itemId, token);

    const expectedCalls = [[{ type: 'CREATE_CHAT_SUCCESSFUL' }]];
    expect(dispatchSpy.mock.calls).toEqual(expectedCalls);
  });

  test('fails to create a new chat', async () => {
    fetch.mockResponseSuccess({ ok: false });
    const dispatchSpy = jest.fn();

    // lol
    await await await await handleChatCreation(dispatchSpy, sellerId, itemId, token);

    const expectedCalls = [[{ error: 'error', type: 'CREATE_CHAT_FAILURE' }]];
    expect(dispatchSpy.mock.calls).toEqual(expectedCalls);
  });

  test('throws an error', async () => {
    fetch.mockResponseFailure('error');
    const dispatchSpy = jest.fn();

    // lol
    await await await await handleChatCreation(dispatchSpy, sellerId, itemId, token);

    const expectedCalls = [[{ error: 'error', type: 'CREATE_CHAT_FAILURE' }]];
    expect(dispatchSpy.mock.calls).toEqual(expectedCalls);
  });
});
