import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { styles } from '../../static/styles/ImagePlaceHolderStyles';
const { height, width } = Dimensions.get('window');

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
          source={{ uri: this.props.url }}
          style={styles.image}
          onLoad={this._onLoad}
        />

        {!this.state.isLoaded && (
          <View style={styles.placeholderView}>
            <MaterialIcons
              name="image"
              size={height * 0.4}
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
    width: width,
    height: width,
  },
  placeholder: {
    position: 'absolute',
  },
  placeholderView: {
    backgroundColor: '#FFFFFF',
  },
});
