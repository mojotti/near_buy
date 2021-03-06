import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { styles } from '../../static/styles/ListViewItemStyle';
import { localhost } from '../../static/constants';
import ImagePlaceholder from '../image_placeholder/ImagePlaceholder';

const WIDTH = Dimensions.get('window').width;

export class _ChatDetails extends PureComponent {
  _navigateToChat = () => {
    const { navigate } = this.props.navigation;
    navigate('Chat', { item: this.props.item.item });
  };

  render() {
    const { id } = this.props.item.item;
    const imagePath = `http://${localhost}:5000/api/v1.0/${id}/image0.jpg`;

    return (
      <View>
        <TouchableOpacity onPress={this._navigateToChat}>
          <View style={styles.itemContainer}>
            <View style={styles.imagePlaceholderContainer}>
              <View style={styles.imageContainer}>
                <ImagePlaceholder
                  styles={styles.image}
                  url={imagePath}
                  placeholderSize={WIDTH * 0.15}
                />
              </View>
            </View>
            <View style={[styles.item, { alignSelf: 'center' }]}>
              <Text style={styles.title}>{this.props.item.item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

_ChatDetails.propTypes = {
  item: PropTypes.shape({
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      seller_id: PropTypes.number.isRequired,
      buyer_id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const ChatDetails = withNavigation(_ChatDetails);
export default ChatDetails;
