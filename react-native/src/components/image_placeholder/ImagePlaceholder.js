import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { styles } from '../../static/styles/ImagePlaceHolderStyles';
const { height } = Dimensions.get('window');

export default class ImagePlaceholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  _onLoad = () => {
    this.setState(() => ({ isLoaded: true }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.props.url + '?' + new Date() }}
          style={[styles.image, this.props.styles]}
          onLoad={this._onLoad}
        />

        {!this.state.isLoaded && (
          <View style={styles.placeholderView}>
            <MaterialIcons
              name="image"
              size={this.props.styles.height * 0.4}
              color="gray"
              style={styles.placeholder}
            />
          </View>
        )}
      </View>
    );
  }
}

ImagePlaceholder.propTypes = {
  url: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
  },
  placeholder: {
    position: 'absolute',
  },
  placeholderView: {
    backgroundColor: '#FFFFFF',
  },
});
