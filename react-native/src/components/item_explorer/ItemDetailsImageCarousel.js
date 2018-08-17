import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import ImagePlaceholder from '../image_placeholder/ImagePlaceholder';
import { styles } from '../../static/styles/ItemDetailsImageCarouselStyles';

const { width } = Dimensions.get('window');


export default class ItemDetailsImageCarousel extends React.Component {
  renderCarousel = () => {
    return (
      <Carousel
        style={styles.size}
        autoplay={false}
        pageInfo
        currentPage={0}
        pageInfoBackgroundColor={'#292929'}
        pageInfoTextStyle={{ color: '#FFFFFF' }}
      >
        {this.props.images.map((uri, i) => (
          <ImagePlaceholder
            url={uri}
            styles={styles.size}
            placeholderSize={width}
            key={i}
          />
        ))}
      </Carousel>
    );
  };

  renderAsImage = () => {
    return (
      <View style={styles.size}>
        <ImagePlaceholder
          url={this.props.images[0]}
          styles={styles.size}
          placeholderSize={width}
        />
      </View>
    );
  };
  render() {
    const len = this.props.images.length; // due to a bug in carousel ios
    const isIos = Platform.OS === 'ios';
    return (len <= 1 && isIos) ? this.renderAsImage() : this.renderCarousel();

  }
}

ItemDetailsImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
