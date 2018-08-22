import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../static/styles/ItemCardStyles';
import { baseStyles } from '../../static/styles/BaseStyles';
import { localhost } from '../../static/constants';

export class _ItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distanceInKm: 'Getting distance...',
    };
  }

  componentDidMount() {
    this._getDistanceInKm(
      this.props.latitude,
      this.props.longitude,
      this.props.item.latitude,
      this.props.item.longitude,
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.item.latitude !== this.props.item.latitude ||
      prevProps.item.longitude !== this.props.item.longitude ||
      prevProps.latitude !== this.props.latitude ||
      prevProps.longitude !== this.props.longitude
    ) {
      this._getDistanceInKm(
        this.props.latitude,
        this.props.longitude,
        this.props.item.latitude,
        this.props.item.longitude,
      );
    }
  }

  _degreesToRadians = degrees => degrees * Math.PI / 180;

  _getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = this._degreesToRadians(lat2 - lat1);
    const dLon = this._degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._degreesToRadians(lat1)) *
        Math.cos(this._degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    this.setState(() => ({ distanceInKm: `${d.toFixed(1)} km` }));
  };

  _getImageSource = () => {
    return `http://${localhost}:5000/api/v1.0/${this.props.item.id}/image0.jpg`;
  };

  _navigateToItem = () => {
    const { navigate } = this.props.navigation;
    navigate(
      'ItemDetails',
      { item: this.props.item, distance: this.state.distanceInKm },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._navigateToItem}>
          <Text style={baseStyles.headerText}>{this.props.item.title}</Text>
          <Image source={{ uri: this._getImageSource() }} style={styles.image} />
          <Text style={baseStyles.headerText}>
            {`Distance: ${this.state.distanceInKm}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { latitude, longitude } = state.locationReducer;
  return { latitude, longitude };
};

const ItemCard = connect(mapStateToProps, null)(_ItemCard);
export default ItemCard;

_ItemCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.number,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};
