import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import { styles } from '../../static/styles/UserItemDetailsStyles';

const ANIMATION_TIME = 500;

export default class UserItemMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinate: new AnimatedRegion({
        latitude: this.props.latitude,
        longitude: this.props.longitude,
      }),
    };
    this.animatedMarker = null;
  }

  isLatLongDifferent = prevProps => {
    return (
      this.props.longitude !== prevProps.longitude ||
      this.props.latitude !== prevProps.latitude
    );
  };

  shouldComponentUpdate(prevProps) {
    return this.isLatLongDifferent(prevProps);
  }

  componentDidUpdate(prevProps) {
    if (this.isLatLongDifferent(prevProps)) {
      this.animateItemToNewLocation();
    }
  }

  animateItemToNewLocation = () => {
    const newCoordinate = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    };

    if (Platform.OS === 'android') {
      if (this.animatedMarker) {
        this.animatedMarker._component.animateMarkerToCoordinate(
          newCoordinate,
          ANIMATION_TIME
        );
      }
    } else {
      const { coordinate } = this.state;
      coordinate.timing({ ...newCoordinate, ANIMATION_TIME }).start();
    }
  };

  getCenterLocation = () => {
    return {
      centerLongitude:
        (this.props.longitude + this.props.currentLocation.longitude) / 2,
      centerLatitude:
        (this.props.latitude + this.props.currentLocation.latitude) / 2,
    };
  };

  getLocationDeltas = () => {
    return {
      latitudeDelta:
        Math.abs(this.props.latitude - this.props.currentLocation.latitude) +
        0.006,
      longitudeDelta:
        Math.abs(this.props.longitude - this.props.currentLocation.longitude) +
        0.0017,
    };
  };

  render() {
    const { latitudeDelta, longitudeDelta } = this.getLocationDeltas();
    const { centerLatitude, centerLongitude } = this.getCenterLocation();

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: centerLatitude,
            longitude: centerLongitude,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          <Marker.Animated
            ref={marker => {
              this.animatedMarker = marker;
            }}
            coordinate={this.state.coordinate}
            title={`Item's current location`}
            pinColor={'#100eff'}
          />
          <Marker.Animated
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
