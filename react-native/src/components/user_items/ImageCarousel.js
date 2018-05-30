import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import { styles } from '../../static/styles/UserItemDetailsStyles';
import DetailImage from './DetailImage';

export default class ImageCarousel extends React.Component {
  render() {
    return (
      <Carousel
        style={styles.carousel}
        autoplay={false}
        pageInfo
        currentPage={0}
        onAnimateNextPage={p => console.log(p)}
        arrows
        arrowStyle={styles.arrowStyle}
        leftArrowText={' '}
        rightArrowText={' '}
      >
        <DetailImage url={this.props.imageUrls[0]} />
        <DetailImage url={this.props.imageUrls[1]} />
        <DetailImage url={this.props.imageUrls[2]} />
        <DetailImage url={this.props.imageUrls[3]} />
      </Carousel>
    );
  }
}

ImageCarousel.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};
