import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { styles } from '../../static/styles/ListViewItemStyle';
import { localhost } from '../../static/constants';
import ImagePlaceholder from '../image_placeholder/ImagePlaceholder';

const WIDTH = Dimensions.get('window').width;

export class _Chat extends PureComponent {
  _navigateToChat = () => {};

  render() {
    const id = this.props.item.item.item_id;
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
            <View style={styles.item}>
              <Text style={styles.title}>{this.props.item.item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

_Chat.propTypes = {
  item: PropTypes.shape({
    item: PropTypes.shape({
      item_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      seller_id: PropTypes.number.isRequired,
      buyer_id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

const Chat = connect(mapStateToProps, null)(_Chat);
export default Chat;
