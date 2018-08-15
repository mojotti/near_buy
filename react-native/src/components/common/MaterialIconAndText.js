import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../static/styles/MaterialIconAndTextStyles';

const { width } = Dimensions.get('window');


export default class MaterialIconAndText extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcon
            name={this.props.iconName}
            size={width * 0.22}
            style={styles.iconStyles}
          />
        </View>
        <Text style={styles.noItemsText}>{this.props.headerText}</Text>
        <Text style={styles.noItemsText}>{this.props.containerText}</Text>
      </View>
    );
  }
}

MaterialIconAndText.propTypes = {
  iconName: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
  containerText: PropTypes.string.isRequired,
};
