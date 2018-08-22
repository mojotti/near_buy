import { localhost } from '../static/constants';
import { getBearerHeaders } from './networking';


export const createNewChat = (sellerId, itemId, token) => {
  const ipAddress = `http://${localhost}:5000/api/v1.0/new_chat`;

  return fetch(ipAddress, {
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
