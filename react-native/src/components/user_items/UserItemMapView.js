import React, { Component } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import { styles } from '../../static/styles/UserItemDetailsStyles';

export default class UserItemMapView extends Component {
  render() {
    const latitudeDelta =
      Math.abs(this.props.latitude - this.props.currentLocation.latitude) +
      0.004;
    const longitudeDelta =
      Math.abs(this.props.longitude - this.props.currentLocation.longitude) +
      0.0013;
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          <Marker
            coordinate={{
              longitude: this.props.longitude,
              latitude: this.props.latitude,
            }}
            title={`Item's current location`}
          />
          <Marker
            coordinate={{
              longitude: this.props.currentLocation.longitude,
              latitude: this.props.currentLocation.latitude,
            }}
            title={`Your location`}
          />
        </MapView>
      </View>
    );
  }
}

UserItemMapView.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  currentLocation: PropTypes.objectOf(PropTypes.number).isRequired,
};
