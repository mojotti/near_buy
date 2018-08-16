import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import ImagePlaceholder from '../image_placeholder/ImagePlaceholder';
import { styles } from '../../static/styles/ItemDetailsImageCarouselStyles';

const { width } = Dimensions.get('window');


export default class ItemDetailsImageCarousel extends React.Component {
  render() {
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
  }
}

ItemDetailsImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
