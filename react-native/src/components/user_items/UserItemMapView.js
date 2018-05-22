import React, { Component } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import { styles } from '../../static/styles/UserItemDetailsStyles';


export default class UserItemMapView extends Component {
  render() {
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0221,
          }}
        >
          <Marker
            coordinate={{
              longitude: this.props.longitude,
              latitude: this.props.latitude,
            }}
            title={`Item's current location`}
            description={`Exact location is not visible to others`}
          />
        </MapView>
      </View>
    );
  }
}

UserItemMapView.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
};
