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
        pageInfoBackgroundColor={'#292929'}
        pageInfoTextStyle={{ color: '#FFFFFF' }}
    // arrows are disabled for now since they don't work as intended on ios
        arrows={false}
        arrowStyle={styles.arrowStyle}
        leftArrowText={' '}
        rightArrowText={' '}
      >
        <DetailImage
          url={this.props.imageUrls[0]}
          id={this.props.id}
          numOfPics={this.props.numOfPics}
          onImageUpload={this.props.onImageUpload}
        />
        <DetailImage
          url={this.props.imageUrls[1]}
          id={this.props.id}
          numOfPics={this.props.numOfPics}
          onImageUpload={this.props.onImageUpload}
        />
        <DetailImage
          url={this.props.imageUrls[2]}
          id={this.props.id}
          numOfPics={this.props.numOfPics}
          onImageUpload={this.props.onImageUpload}
        />
        <DetailImage
          url={this.props.imageUrls[3]}
          id={this.props.id}
          numOfPics={this.props.numOfPics}
          onImageUpload={this.props.onImageUpload}
        />
      </Carousel>
    );
  }
}

ImageCarousel.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  numOfPics: PropTypes.number.isRequired,
};
