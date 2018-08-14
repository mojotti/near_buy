const initialState = {
  items: [],
  isFetching: false,
  error: null,
};

export const itemExplorerReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'FETCHING_ITEMS':
    return Object.assign({}, state, {
      isFetching: true,
    });
  case 'FETCH_ITEMS_SUCCESS':
    return Object.assign({}, state, {
      isFetching: false,
      items: action.items,
    });
  case 'FETCH_ITEMS_FAILURE':
    return Object.assign({}, state, {
      isFetching: false,
      error: action.error,
    });
  default:
    return state;
  }
};
