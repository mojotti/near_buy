const initialState = {
  currentTab: 'All items',
};

export const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'NAVIGATE_TO_ITEM': {
    return Object.assign({}, state, {
      currentTab: action.itemName,
    });
  }
  default:
    return state;
  }
};
