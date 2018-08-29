import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, View } from 'react-native';
import { styles } from '../../static/styles/NavigationBarIconAndTextStyles';
import { localhost } from '../../static/constants';

export default class NavigationBarIconAndText extends React.Component {
  render() {
    const id = this.props.imageId;
    const uri = `http://${localhost}:5000/api/v1.0/${id}/image0.jpg`;

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

NavigationBarIconAndText.propTypes = {
  imageId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
