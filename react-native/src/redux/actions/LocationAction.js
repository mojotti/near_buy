export const updateLocation = (coords) => {
  return {
    type: 'UPDATE_LOCATION',
    coords,
  };
};
