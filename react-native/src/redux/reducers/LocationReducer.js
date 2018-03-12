const initialState = {
  latitude: 0.0,
  longitude: 0.0,
};

export const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_LOCATION': {
      return Object.assign({}, state, {
        latitude: action.coords.latitude,
        longitude: action.coords.longitude,
      });
    }
    default:
      return state;
  }
};
