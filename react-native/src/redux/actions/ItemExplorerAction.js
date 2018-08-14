import { localhost } from '../../static/constants';
import { getBearerHeaders } from '../../networking/networking';

export const fetchingItemsAction = () => {
  return {
    type: 'FETCHING_ITEMS',
  };
};

export const fetchItemsSuccessAction = (items) => {
  return {
    type: 'FETCH_ITEMS_SUCCESS',
    items,
  };
};

export const fetchItemsErrorAction = (error) => {
  return {
    type: 'FETCH_ITEMS_FAILURE',
    error,
  };
};

export const requestItemsAction = (token) => {
  return (dispatch) => {
    dispatch(fetchingItemsAction());
    fetchData(dispatch, token);
  };
};

const fetchData = (dispatch, token) => {
  const url = `http://${localhost}:5000/api/v1.0/items_from_others`;

  fetch(url, {
    method: 'GET',
    headers: getBearerHeaders(token),
  })
    .then(response => response.json())
    .then(responseJson => {
      dispatch(fetchItemsSuccessAction(responseJson.items));
    })
    .catch(error => {
      dispatch(fetchItemsErrorAction(error));
    });
};
