import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { styles } from '../../static/styles/ImagePlaceHolderStyles';

export default class ImagePlaceholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  _onLoad = () => this.setState(() => ({ isLoaded: true }));

  render() {
    console.log('rendering', this.props.url);
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.props.url }}//+ '?' + new Date() }}
          style={[styles.image, this.props.styles]}
          onLoad={this._onLoad}
        />

        {!this.state.isLoaded && (
          <View style={[styles.placeholderBackground, this.props.styles]}>
            <MaterialIcons
              name="image"
              size={this.props.placeholderSize}
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
  placeholderBackground: {
    backgroundColor: 'white',
  },
  placeholder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
