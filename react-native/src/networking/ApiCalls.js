import { localhost } from '../static/constants';
import { getBearerHeaders } from './networking';


export const createNewChat = (sellerId, itemId, token) => {
  const url = `http://${localhost}:5000/api/v1.0/new_chat`;

  return fetch(url, {
    method: 'POST',
    headers: getBearerHeaders(token),
    body: JSON.stringify({
      other_user: sellerId,
      item_id: itemId,
    }),
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.ok) return 'chat created';
      return 'error';
    })
    .catch(error => {
      console.error(error);
      return 'error';
    });
};

export const getChatsForUser = (token) => {
  const url = `http://${localhost}:5000/api/v1.0/chats`;
  return fetch(url, {
    method: 'GET',
    headers: getBearerHeaders(token),
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.ok !== undefined && responseJson.ok === false) {
        return 'could not get chats';
      }
      return responseJson.chats;
    })
    .catch(error => {
      console.error(error);
      return 'error';
    });
};

export const getNumOfPictures = (itemId, token) => {
  const url = `http://${localhost}:5000/api/v1.0/${itemId}/num_of_images`;
  return fetch(url, {
    method: 'GET',
    headers: getBearerHeaders(token),
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.num_of_images;
    })
    .catch(error => {
      console.error(error);
      return 0;
    });
};
