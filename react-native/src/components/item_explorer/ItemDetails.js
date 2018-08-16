import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';


export class _ItemDetails extends React.Component {
  static navigationOptions = {
    title: 'Item details',
  };

  render() {
    console.log('thisan', this.props);
    return (
      <View></View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { item } = ownProps.navigation.state.params;
  return { item };
};

const ItemDetails = connect(mapStateToProps, null)(_ItemDetails);
export default ItemDetails;
